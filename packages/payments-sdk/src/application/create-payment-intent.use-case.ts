import { Money } from '../domain/value-objects/money.vo';
import { PaymentIntent } from '../domain/entities/payment-intent.entity';
import { PaymentGateway } from '../domain/ports/payment-gateway.port';
import { CredentialsProvider } from '../domain/ports/credentials-provider.port';
import { CredentialsNotFoundError } from '../domain/errors/credentials-not-found.error';

export type CreatePaymentIntentInput = {
  tenantId: string;
  amount: Money;
  provider: string;
  externalReference?: string;
  metadata?: Record<string, unknown>;
};

export class CreatePaymentIntent {
  constructor(
    private readonly paymentGateway: PaymentGateway,
    private readonly credentialsProvider: CredentialsProvider,
  ) {}

  public async execute(input: CreatePaymentIntentInput): Promise<PaymentIntent> {
    const credentials = await this.credentialsProvider.resolve(input.tenantId);
    if (!credentials) {
      throw new CredentialsNotFoundError(input.tenantId);
    }
    return this.paymentGateway.create({
      amount: input.amount,
      provider: input.provider,
      externalReference: input.externalReference,
      metadata: input.metadata,
      credentials,
    });
  }
}
