export const OrderItemStatus = {
  CREATED: 'CREATED',
  PREPARING: 'PREPARING',
  PREPARED: 'PREPARED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
} as const;

export type OrderItemStatusType =
  (typeof OrderItemStatus)[keyof typeof OrderItemStatus];
