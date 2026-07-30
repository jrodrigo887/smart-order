import { EntityBase } from '@/shared/entities/entity-base';
import { OrderItemStatusError } from '../errors/order-item-status.error';
import { UnauthorizedCancellationError } from '../errors/unauthorized-cancellation.error';
import {
  OrderItemStatus,
  OrderItemStatusType,
} from '../enums/order-item-status.enum';

export const CancellationRole = {
  OWNER: 'OWNER',
  WAITER: 'WAITER',
} as const;

export type CancellationRoleType =
  (typeof CancellationRole)[keyof typeof CancellationRole];

export type CancellationActor = { role: CancellationRoleType };

export type OrderItemProps = {
  orderId: string;
  description: string;
  quantity: number;
  status: OrderItemStatusType;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class OrderItem extends EntityBase {
  private constructor(public readonly props: OrderItemProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: OrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  public get orderId(): string {
    return this.props.orderId;
  }

  public get description(): string {
    return this.props.description;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public get status(): OrderItemStatusType {
    return this.props.status;
  }

  public startPreparing(): void {
    if (this.props.status !== OrderItemStatus.CREATED) {
      throw new OrderItemStatusError(
        `Cannot start preparing an OrderItem with status ${this.props.status}`,
      );
    }
    this.props.status = OrderItemStatus.PREPARING;
    this.props.updatedAt = new Date();
  }

  public markPrepared(): void {
    if (this.props.status !== OrderItemStatus.PREPARING) {
      throw new OrderItemStatusError(
        `Cannot mark as prepared an OrderItem with status ${this.props.status}`,
      );
    }
    this.props.status = OrderItemStatus.PREPARED;
    this.props.updatedAt = new Date();
  }

  public markDelivered(): void {
    if (this.props.status !== OrderItemStatus.PREPARED) {
      throw new OrderItemStatusError(
        `Cannot mark as delivered an OrderItem with status ${this.props.status}`,
      );
    }
    this.props.status = OrderItemStatus.DELIVERED;
    this.props.updatedAt = new Date();
  }

  // ADR-0004: an item still CREATED cancels freely; once the kitchen starts
  // preparing it, cancelling requires Owner authorization.
  public cancel(actor?: CancellationActor): void {
    if (
      this.props.status === OrderItemStatus.CANCELED ||
      this.props.status === OrderItemStatus.DELIVERED
    ) {
      throw new OrderItemStatusError(
        `Cannot cancel an OrderItem with status ${this.props.status}`,
      );
    }
    if (
      (this.props.status === OrderItemStatus.PREPARING ||
        this.props.status === OrderItemStatus.PREPARED) &&
      actor?.role !== CancellationRole.OWNER
    ) {
      throw new UnauthorizedCancellationError(
        'Cancelling an OrderItem that already started preparing requires Owner authorization',
      );
    }
    this.props.status = OrderItemStatus.CANCELED;
    this.props.updatedAt = new Date();
  }
}
