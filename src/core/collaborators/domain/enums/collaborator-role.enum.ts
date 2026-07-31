export const CollaboratorRole = {
  WAITER: 'WAITER',
  OWNER: 'OWNER',
  KITCHEN_STAFF: 'KITCHEN_STAFF',
  CASHIER: 'CASHIER',
  CLEANING: 'CLEANING',
} as const;

export type CollaboratorRoleType =
  (typeof CollaboratorRole)[keyof typeof CollaboratorRole];
