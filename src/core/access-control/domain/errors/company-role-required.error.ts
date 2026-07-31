export class CompanyRoleRequiredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompanyRoleRequiredError';
  }
}
