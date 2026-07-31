import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CustomerCardStatus } from '@/core/customer-cards/domain/enums/customer-card-status.enum';
import { CustomerCardStatusError } from '@/core/customer-cards/domain/errors/customer-card-status.error';
import { CollaboratorsService } from '@/core/collaborators/infrastructure/collaborators.service';
import { Collaborator } from '@/core/collaborators/domain/entities/collaborator.entity';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { Order } from '../domain/entities/order.entity';
import {
  CancellationActor,
  OrderItem,
} from '../domain/entities/order-item.entity';
import { OrderItemStatus } from '../domain/enums/order-item-status.enum';
import { OrderReadyEvent } from '../domain/events/order-ready.event';
import { UnauthorizedCancellationError } from '../domain/errors/unauthorized-cancellation.error';
import {
  ORDER_REPOSITORY,
  OrderRepositoryContract,
} from '../domain/repositories/order.repository.contract';
import {
  CUSTOMER_CARD_GATEWAY,
  CustomerCardGateway,
} from '../domain/ports/customer-card-gateway';

export type LaunchOrderInput = {
  customerCardId: string;
  items: { description: string; quantity?: number }[];
};

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly repository: OrderRepositoryContract,
    @Inject(CUSTOMER_CARD_GATEWAY)
    private readonly customerCardGateway: CustomerCardGateway,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly eventBus: EventBus,
  ) {}

  async launch(input: LaunchOrderInput): Promise<Order> {
    const customerCard = await this.customerCardGateway.findById(
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
      await this.customerCardGateway.markInUse(customerCard.id);
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
      establishmentId: customerCard.establishmentId,
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
    collaboratorId?: string,
  ): Promise<Order> {
    const order = await this.repository.findById(orderId);
    const actor = await this.resolveCancellationActor(order, collaboratorId);
    order.findItem(itemId).cancel(actor);
    return this.repository.update(orderId, order);
  }

  private async resolveCancellationActor(
    order: Order,
    collaboratorId?: string,
  ): Promise<CancellationActor | undefined> {
    if (!collaboratorId) {
      return undefined;
    }
    let collaborator: Collaborator;
    try {
      collaborator = await this.collaboratorsService.findById(collaboratorId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedCancellationError(
          `Collaborator ${collaboratorId} not found`,
        );
      }
      throw error;
    }
    if (collaborator.establishmentId !== order.establishmentId) {
      throw new UnauthorizedCancellationError(
        `Collaborator ${collaboratorId} does not belong to the Order's Establishment`,
      );
    }
    return { role: collaborator.role };
  }

  async listPendingByEstablishment(establishmentId: string): Promise<Order[]> {
    return this.repository.findPendingByEstablishmentId(establishmentId);
  }
}
