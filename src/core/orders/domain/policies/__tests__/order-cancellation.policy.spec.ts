import { OrderItemStatus } from '../../enums/order-item-status.enum';
import {
  CancellationRole,
  canCancelOrderItem,
} from '../order-cancellation.policy';

describe('canCancelOrderItem', () => {
  it('allows cancelling a CREATED item with no actor', () => {
    expect(canCancelOrderItem(OrderItemStatus.CREATED)).toBe(true);
  });

  it.each([[OrderItemStatus.PREPARING], [OrderItemStatus.PREPARED]] as const)(
    'denies cancelling a %s item with no actor',
    (status) => {
      expect(canCancelOrderItem(status)).toBe(false);
    },
  );

  it.each([[OrderItemStatus.PREPARING], [OrderItemStatus.PREPARED]] as const)(
    'denies cancelling a %s item for a non-Owner actor',
    (status) => {
      expect(
        canCancelOrderItem(status, { role: CancellationRole.WAITER }),
      ).toBe(false);
    },
  );

  it.each([[OrderItemStatus.PREPARING], [OrderItemStatus.PREPARED]] as const)(
    'allows cancelling a %s item for an Owner actor',
    (status) => {
      expect(canCancelOrderItem(status, { role: CancellationRole.OWNER })).toBe(
        true,
      );
    },
  );

  it.each([[OrderItemStatus.DELIVERED], [OrderItemStatus.CANCELED]] as const)(
    'is not blocked by authorization for a %s item, even without an actor',
    (status) => {
      expect(canCancelOrderItem(status)).toBe(true);
    },
  );
});
