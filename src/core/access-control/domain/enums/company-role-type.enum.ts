export const CompanyRoleType = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  MEMBER: 'MEMBER',
} as const;

export type CompanyRoleTypeType =
  (typeof CompanyRoleType)[keyof typeof CompanyRoleType];
