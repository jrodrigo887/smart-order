export const CustomerCardStatus = {
  OPEN: 'OPEN',
  IN_USE: 'IN_USE',
  CLOSED: 'CLOSED',
  CANCELED: 'CANCELED',
} as const;

export type CustomerCardStatusType =
  (typeof CustomerCardStatus)[keyof typeof CustomerCardStatus];
