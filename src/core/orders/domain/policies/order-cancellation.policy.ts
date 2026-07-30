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

// Authorization only — whether a finished item (DELIVERED/CANCELED) can be
// cancelled at all is a state-machine invariant enforced by OrderItem.cancel(),
// not an authorization concern, so it's left unblocked here.
export function canCancelOrderItem(
  status: OrderItemStatusType,
  actor?: CancellationActor,
): boolean {
  if (
    status === OrderItemStatus.PREPARING ||
    status === OrderItemStatus.PREPARED
  ) {
    return actor?.role === CancellationRole.OWNER;
  }
  return true;
}
