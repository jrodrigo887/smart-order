import { EntityBase } from '@/shared/entities/entity-base';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { OrderValidationError } from '../errors/order-validation.error';
import { OrderItemStatus } from '../enums/order-item-status.enum';
import { OrderItem } from './order-item.entity';

export type OrderProps = {
  customerCardId: string;
  restaurantId: string;
  items: OrderItem[];
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Order extends EntityBase {
  private constructor(public readonly props: OrderProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: OrderProps): Order {
    if (!props.items || props.items.length === 0) {
      throw new OrderValidationError('An Order must have at least one item');
    }
    return new Order(props);
  }

  public get customerCardId(): string {
    return this.props.customerCardId;
  }

  public get restaurantId(): string {
    return this.props.restaurantId;
  }

  public get items(): OrderItem[] {
    return this.props.items;
  }

  public findItem(itemId: string): OrderItem {
    const item = this.props.items.find((item) => item.id === itemId);
    if (!item) {
      throw new NotFoundError(
        `OrderItem with id ${itemId} not found in this Order`,
      );
    }
    return item;
  }

  // PRONTO is derived: true once every non-cancelled item is prepared or delivered.
  public isReady(): boolean {
    const activeItems = this.props.items.filter(
      (item) => item.status !== OrderItemStatus.CANCELED,
    );
    return (
      activeItems.length > 0 &&
      activeItems.every(
        (item) =>
          item.status === OrderItemStatus.PREPARED ||
          item.status === OrderItemStatus.DELIVERED,
      )
    );
  }
}
