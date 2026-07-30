import { faker } from '@faker-js/faker';
import { EventBus } from '@nestjs/cqrs';
import { CustomerCardsService } from '@/core/customer-cards/infrastructure/customer-cards.service';
import { InMemoryCustomerCardRepository } from '@/core/customer-cards/infrastructure/repositories/in-memory-customer-card.repository';
import { CustomerCardStatus } from '@/core/customer-cards/domain/enums/customer-card-status.enum';
import { CustomerCardStatusError } from '@/core/customer-cards/domain/errors/customer-card-status.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { UnauthorizedCancellationError } from '../../domain/errors/unauthorized-cancellation.error';
import { OrderReadyEvent } from '../../domain/events/order-ready.event';
import { CancellationRole } from '../../domain/policies/order-cancellation.policy';
import { InMemoryOrderRepository } from '../repositories/in-memory-order.repository';
import { LaunchOrderInput, OrdersService } from '../orders.service';

describe('OrdersService', () => {
  let sut: OrdersService;
  let orderRepository: InMemoryOrderRepository;
  let customerCardsService: CustomerCardsService;
  let eventBus: { publish: jest.Mock };
  let customerCardId: string;
  let restaurantId: string;
  let launchInput: LaunchOrderInput;

  beforeEach(async () => {
    orderRepository = new InMemoryOrderRepository();
    customerCardsService = new CustomerCardsService(
      new InMemoryCustomerCardRepository(),
    );
    eventBus = { publish: jest.fn() };
    sut = new OrdersService(
      orderRepository,
      customerCardsService,
      eventBus as unknown as EventBus,
    );

    restaurantId = faker.string.uuid();
    const customerCard = await customerCardsService.open({
      cardNumber: faker.number.int({ min: 1, max: 999 }),
      waiterId: faker.string.uuid(),
      restaurantId,
    });
    customerCardId = customerCard.id;
    launchInput = {
      customerCardId,
      items: [
        { description: 'X-Burguer' },
        { description: 'Refrigerante', quantity: 2 },
      ],
    };
  });

  it('should launch an Order with its items', async () => {
    const order = await sut.launch(launchInput);

    expect(order.id).toBeDefined();
    expect(order.customerCardId).toEqual(customerCardId);
    expect(order.restaurantId).toEqual(restaurantId);
    expect(order.items).toHaveLength(2);
    expect(order.items[1].quantity).toEqual(2);
  });

  it('should transition the CustomerCard from OPEN to IN_USE on the first Order', async () => {
    await sut.launch(launchInput);

    const customerCard = await customerCardsService.findById(customerCardId);
    expect(customerCard.status).toEqual(CustomerCardStatus.IN_USE);
  });

  it('should not launch an Order on a CLOSED CustomerCard', async () => {
    await customerCardsService.close(customerCardId);

    await expect(sut.launch(launchInput)).rejects.toThrow(
      CustomerCardStatusError,
    );
  });

  it('should not launch an Order on a CANCELED CustomerCard', async () => {
    await customerCardsService.cancel(customerCardId);

    await expect(sut.launch(launchInput)).rejects.toThrow(
      CustomerCardStatusError,
    );
  });

  it('should progress an item through the kitchen flow', async () => {
    const order = await sut.launch(launchInput);
    const itemId = order.items[0].id;

    await sut.startPreparingItem(order.id, itemId);
    const prepared = await sut.markItemPrepared(order.id, itemId);
    expect(prepared.findItem(itemId).status).toEqual('PREPARED');

    const delivered = await sut.markItemDelivered(order.id, itemId);
    expect(delivered.findItem(itemId).status).toEqual('DELIVERED');
  });

  it('should publish OrderReadyEvent only once every item becomes prepared', async () => {
    const order = await sut.launch(launchInput);
    const [item1, item2] = order.items;

    await sut.startPreparingItem(order.id, item1.id);
    await sut.markItemPrepared(order.id, item1.id);
    expect(eventBus.publish).not.toHaveBeenCalled();

    await sut.startPreparingItem(order.id, item2.id);
    await sut.markItemPrepared(order.id, item2.id);
    expect(eventBus.publish).toHaveBeenCalledTimes(1);
    expect(eventBus.publish).toHaveBeenCalledWith(expect.any(OrderReadyEvent));
  });

  it('should not publish OrderReadyEvent again on further item transitions', async () => {
    const order = await sut.launch(launchInput);
    const [item1, item2] = order.items;
    await sut.startPreparingItem(order.id, item1.id);
    await sut.markItemPrepared(order.id, item1.id);
    await sut.startPreparingItem(order.id, item2.id);
    await sut.markItemPrepared(order.id, item2.id);

    await sut.markItemDelivered(order.id, item1.id);

    expect(eventBus.publish).toHaveBeenCalledTimes(1);
  });

  it('should cancel a CREATED item freely, with no actor', async () => {
    const order = await sut.launch(launchInput);
    const itemId = order.items[0].id;

    const updated = await sut.cancelItem(order.id, itemId);

    expect(updated.findItem(itemId).status).toEqual('CANCELED');
  });

  it('should not cancel an item in preparation without an Owner actor', async () => {
    const order = await sut.launch(launchInput);
    const itemId = order.items[0].id;
    await sut.startPreparingItem(order.id, itemId);

    await expect(sut.cancelItem(order.id, itemId)).rejects.toThrow(
      UnauthorizedCancellationError,
    );
    await expect(
      sut.cancelItem(order.id, itemId, { role: CancellationRole.WAITER }),
    ).rejects.toThrow(UnauthorizedCancellationError);
  });

  it('should cancel an item in preparation when authorized by an Owner actor', async () => {
    const order = await sut.launch(launchInput);
    const itemId = order.items[0].id;
    await sut.startPreparingItem(order.id, itemId);

    const updated = await sut.cancelItem(order.id, itemId, {
      role: CancellationRole.OWNER,
    });

    expect(updated.findItem(itemId).status).toEqual('CANCELED');
  });

  it('should throw NotFoundError for an unknown order', async () => {
    await expect(
      sut.startPreparingItem(faker.string.uuid(), faker.string.uuid()),
    ).rejects.toThrow(NotFoundError);
  });

  it('should list only pending (not-ready) orders for a restaurant', async () => {
    const order = await sut.launch(launchInput);

    const pending = await sut.listPendingByRestaurant(restaurantId);

    expect(pending).toHaveLength(1);
    expect(pending[0].id).toEqual(order.id);
  });

  it('should not list a fully prepared order as pending', async () => {
    const order = await sut.launch(launchInput);
    for (const item of order.items) {
      await sut.startPreparingItem(order.id, item.id);
      await sut.markItemPrepared(order.id, item.id);
    }

    const pending = await sut.listPendingByRestaurant(restaurantId);

    expect(pending).toHaveLength(0);
  });
});
