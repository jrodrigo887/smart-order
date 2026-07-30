import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CustomerCardsService } from '@/core/customer-cards/infrastructure/customer-cards.service';
import { CustomerCardStatus } from '@/core/customer-cards/domain/enums/customer-card-status.enum';
import { CustomerCardStatusError } from '@/core/customer-cards/domain/errors/customer-card-status.error';
import { Order } from '../domain/entities/order.entity';
import { OrderItem } from '../domain/entities/order-item.entity';
import { OrderItemStatus } from '../domain/enums/order-item-status.enum';
import { OrderReadyEvent } from '../domain/events/order-ready.event';
import { UnauthorizedCancellationError } from '../domain/errors/unauthorized-cancellation.error';
import {
  CancellationActor,
  canCancelOrderItem,
} from '../domain/policies/order-cancellation.policy';
import {
  ORDER_REPOSITORY,
  OrderRepositoryContract,
} from '../domain/repositories/order.repository.contract';

export type LaunchOrderInput = {
  customerCardId: string;
  items: { description: string; quantity?: number }[];
};

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryContract,
    private readonly customerCardsService: CustomerCardsService,
    private readonly eventBus: EventBus,
  ) {}

  async launch(input: LaunchOrderInput): Promise<Order> {
    const customerCard = await this.customerCardsService.findById(
      input.customerCardId,
    );
    if (
      customerCard.status === CustomerCardStatus.CLOSED ||
      customerCard.status === CustomerCardStatus.CANCELED
    ) {
      throw new CustomerCardStatusError(
        `Cannot launch an Order on a CustomerCard with status ${customerCard.status}`,
      );
    }
    if (customerCard.isOpen()) {
      await this.customerCardsService.markInUse(customerCard.id);
    }

    const orderId = uuidv4();
    const items = input.items.map((item) =>
      OrderItem.create({
        orderId,
        description: item.description,
        quantity: item.quantity ?? 1,
        status: OrderItemStatus.CREATED,
      }),
    );
    const order = Order.create({
      id: orderId,
      customerCardId: customerCard.id,
      restaurantId: customerCard.restaurantId,
      items,
    });
    return this.repository.create(order);
  }

  async startPreparingItem(orderId: string, itemId: string): Promise<Order> {
    const order = await this.repository.findById(orderId);
    order.findItem(itemId).startPreparing();
    return this.repository.update(orderId, order);
  }

  async markItemPrepared(orderId: string, itemId: string): Promise<Order> {
    const order = await this.repository.findById(orderId);
    const wasReady = order.isReady();
    order.findItem(itemId).markPrepared();
    const updated = await this.repository.update(orderId, order);
    if (!wasReady && updated.isReady()) {
      this.eventBus.publish(new OrderReadyEvent(updated));
    }
    return updated;
  }

  async markItemDelivered(orderId: string, itemId: string): Promise<Order> {
    const order = await this.repository.findById(orderId);
    order.findItem(itemId).markDelivered();
    return this.repository.update(orderId, order);
  }

  async cancelItem(
    orderId: string,
    itemId: string,
    actor?: CancellationActor,
  ): Promise<Order> {
    const order = await this.repository.findById(orderId);
    const item = order.findItem(itemId);
    if (!canCancelOrderItem(item.status, actor)) {
      throw new UnauthorizedCancellationError(
        'Cancelling an OrderItem that already started preparing requires Owner authorization',
      );
    }
    item.cancel();
    return this.repository.update(orderId, order);
  }

  async listPendingByRestaurant(restaurantId: string): Promise<Order[]> {
    const all = await this.repository.findAll();
    return all.filter(
      (order) => order.restaurantId === restaurantId && !order.isReady(),
    );
  }
}
