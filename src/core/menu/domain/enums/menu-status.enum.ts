export const MenuStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type MenuStatusType = (typeof MenuStatus)[keyof typeof MenuStatus];
