export class CredentialsNotFoundError extends Error {
  constructor(tenantId: string) {
    super(`No payment gateway credentials found for tenant ${tenantId}`);
    this.name = 'CredentialsNotFoundError';
  }
}
