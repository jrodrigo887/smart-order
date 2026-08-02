export const MenuItemStatus = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
} as const;

export type MenuItemStatusType =
  (typeof MenuItemStatus)[keyof typeof MenuItemStatus];
