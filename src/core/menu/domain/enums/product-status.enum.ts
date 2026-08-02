export const ProductStatus = {
  ACTIVE: 'ACTIVE',
  DISCONTINUED: 'DISCONTINUED',
} as const;

export type ProductStatusType =
  (typeof ProductStatus)[keyof typeof ProductStatus];
