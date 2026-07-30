import { faker } from '@faker-js/faker';
import { OrderItemStatus } from '../../enums/order-item-status.enum';
import { OrderItemStatusError } from '../../errors/order-item-status.error';
import { OrderItem, OrderItemProps } from '../order-item.entity';

describe('OrderItemEntity', () => {
  let orderItem: OrderItem;
  let props: OrderItemProps;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      orderId: faker.string.uuid(),
      description: 'X-Burguer',
      quantity: 2,
      status: OrderItemStatus.CREATED,
    };
    orderItem = OrderItem.create(props);
  });

  it('should create a valid OrderItem instance', () => {
    expect(orderItem).toBeInstanceOf(OrderItem);
    expect(orderItem.orderId).toEqual(props.orderId);
    expect(orderItem.description).toEqual(props.description);
    expect(orderItem.quantity).toEqual(props.quantity);
    expect(orderItem.status).toEqual(OrderItemStatus.CREATED);
  });

  it('should transition CREATED -> PREPARING -> PREPARED -> DELIVERED', () => {
    orderItem.startPreparing();
    expect(orderItem.status).toEqual(OrderItemStatus.PREPARING);

    orderItem.markPrepared();
    expect(orderItem.status).toEqual(OrderItemStatus.PREPARED);

    orderItem.markDelivered();
    expect(orderItem.status).toEqual(OrderItemStatus.DELIVERED);
  });

  it('should not start preparing an item that is not CREATED', () => {
    orderItem.startPreparing();
    expect(() => orderItem.startPreparing()).toThrow(OrderItemStatusError);
  });

  it('should not mark as prepared an item that is not PREPARING', () => {
    expect(() => orderItem.markPrepared()).toThrow(OrderItemStatusError);
  });

  it('should not mark as delivered an item that is not PREPARED', () => {
    orderItem.startPreparing();
    expect(() => orderItem.markDelivered()).toThrow(OrderItemStatusError);
  });

  it('should cancel a CREATED item', () => {
    orderItem.cancel();
    expect(orderItem.status).toEqual(OrderItemStatus.CANCELED);
  });

  it('should cancel an item already in preparation', () => {
    orderItem.startPreparing();
    orderItem.cancel();
    expect(orderItem.status).toEqual(OrderItemStatus.CANCELED);
  });

  it.each([[OrderItemStatus.DELIVERED], [OrderItemStatus.CANCELED]] as const)(
    'should never cancel an item with status %s',
    (status) => {
      orderItem = OrderItem.create({ ...props, status });
      expect(() => orderItem.cancel()).toThrow(OrderItemStatusError);
    },
  );
});
