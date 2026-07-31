import { faker } from '@faker-js/faker';
import { OrderItemStatus } from '../../enums/order-item-status.enum';
import { OrderValidationError } from '../../errors/order-validation.error';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { OrderItem } from '../order-item.entity';
import { Order } from '../order.entity';

describe('OrderEntity', () => {
  let customerCardId: string;
  let establishmentId: string;
  let item1: OrderItem;
  let item2: OrderItem;

  beforeEach(() => {
    customerCardId = faker.string.uuid();
    establishmentId = faker.string.uuid();
    item1 = OrderItem.create({
      orderId: faker.string.uuid(),
      description: 'X-Burguer',
      quantity: 1,
      status: OrderItemStatus.CREATED,
    });
    item2 = OrderItem.create({
      orderId: faker.string.uuid(),
      description: 'Refrigerante',
      quantity: 2,
      status: OrderItemStatus.CREATED,
    });
  });

  it('should create a valid Order with its items', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1, item2],
    });

    expect(order).toBeInstanceOf(Order);
    expect(order.customerCardId).toEqual(customerCardId);
    expect(order.establishmentId).toEqual(establishmentId);
    expect(order.items).toHaveLength(2);
  });

  it('should not create an Order without items', () => {
    expect(() =>
      Order.create({ customerCardId, establishmentId, items: [] }),
    ).toThrow(OrderValidationError);
  });

  it('should find an item by id', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1],
    });
    expect(order.findItem(item1.id)).toBe(item1);
  });

  it('should throw NotFoundError when the item does not belong to the Order', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1],
    });
    expect(() => order.findItem(faker.string.uuid())).toThrow(NotFoundError);
  });

  it('should not be ready when items are not yet prepared', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1, item2],
    });
    expect(order.isReady()).toBe(false);
  });

  it('should be ready once every item is prepared', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1, item2],
    });
    item1.startPreparing();
    item1.markPrepared();
    item2.startPreparing();
    item2.markPrepared();

    expect(order.isReady()).toBe(true);
  });

  it('should not be ready while at least one active item is still pending', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1, item2],
    });
    item1.startPreparing();
    item1.markPrepared();

    expect(order.isReady()).toBe(false);
  });

  it('should stay ready when a prepared item is later delivered', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1],
    });
    item1.startPreparing();
    item1.markPrepared();
    item1.markDelivered();

    expect(order.isReady()).toBe(true);
  });

  it('should ignore cancelled items when computing readiness', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1, item2],
    });
    item1.startPreparing();
    item1.markPrepared();
    item2.cancel();

    expect(order.isReady()).toBe(true);
  });

  it('should not be ready when every item has been cancelled', () => {
    const order = Order.create({
      customerCardId,
      establishmentId,
      items: [item1, item2],
    });
    item1.cancel();
    item2.cancel();

    expect(order.isReady()).toBe(false);
  });
});
