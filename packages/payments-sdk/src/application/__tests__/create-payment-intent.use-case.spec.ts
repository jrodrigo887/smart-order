import { CreatePaymentIntent } from '../create-payment-intent.use-case';
import { NoopPaymentGateway } from '../../adapters/noop-payment-gateway.adapter';
import { CredentialsProvider } from '../../domain/ports/credentials-provider.port';
import { CredentialsNotFoundError } from '../../domain/errors/credentials-not-found.error';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { Money } from '../../domain/value-objects/money.vo';

class FakeCredentialsProvider implements CredentialsProvider {
  constructor(private readonly credentialsByTenant: Record<string, unknown>) {}

  async resolve(tenantId: string): Promise<unknown | null> {
    return this.credentialsByTenant[tenantId] ?? null;
  }
}

describe('CreatePaymentIntent', () => {
  it('creates a PENDING PaymentIntent when credentials are found', async () => {
    const useCase = new CreatePaymentIntent(
      new NoopPaymentGateway(),
      new FakeCredentialsProvider({ 'tenant-1': { apiKey: 'secret' } }),
    );

    const paymentIntent = await useCase.execute({
      tenantId: 'tenant-1',
      amount: Money.create(1000, 'BRL'),
      provider: 'noop',
    });

    expect(paymentIntent.status).toBe(PaymentStatus.PENDING);
    expect(paymentIntent.amount.getAmountInCents()).toBe(1000);
  });

  it('fails explicitly when credentials are missing for the tenant', async () => {
    const useCase = new CreatePaymentIntent(
      new NoopPaymentGateway(),
      new FakeCredentialsProvider({}),
    );

    await expect(
      useCase.execute({
        tenantId: 'unknown-tenant',
        amount: Money.create(1000, 'BRL'),
        provider: 'noop',
      }),
    ).rejects.toThrow(CredentialsNotFoundError);
  });
});
