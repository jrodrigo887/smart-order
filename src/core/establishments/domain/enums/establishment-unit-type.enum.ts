export const EstablishmentUnitType = {
  HEADQUARTERS: 'HEADQUARTERS',
  BRANCH: 'BRANCH',
} as const;

export type EstablishmentUnitTypeType =
  (typeof EstablishmentUnitType)[keyof typeof EstablishmentUnitType];
