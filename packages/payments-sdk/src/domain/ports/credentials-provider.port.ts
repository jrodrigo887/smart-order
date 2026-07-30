export const CREDENTIALS_PROVIDER = Symbol('CREDENTIALS_PROVIDER');

export interface CredentialsProvider<TCredentials = unknown> {
  resolve(tenantId: string): Promise<TCredentials | null>;
}
