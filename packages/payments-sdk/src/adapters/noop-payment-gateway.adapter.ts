import {
  PaymentGateway,
  CreatePaymentIntentParams,
} from '../domain/ports/payment-gateway.port';
import { PaymentIntent } from '../domain/entities/payment-intent.entity';
import { PaymentStatus } from '../domain/enums/payment-status.enum';

// Placeholder until a real provider adapter (Stripe, Mercado Pago, etc.) is wired up.
export class NoopPaymentGateway implements PaymentGateway {
  private readonly intents = new Map<string, PaymentIntent>();

  public async create(params: CreatePaymentIntentParams): Promise<PaymentIntent> {
    const paymentIntent = PaymentIntent.create({
      amount: params.amount,
      provider: params.provider,
      externalReference: params.externalReference,
      metadata: params.metadata,
    });
    this.intents.set(paymentIntent.id, paymentIntent);
    return paymentIntent;
  }

  public async capture(paymentIntentId: string): Promise<PaymentIntent> {
    const paymentIntent = this.getOrThrow(paymentIntentId);
    if (paymentIntent.status === PaymentStatus.PENDING) {
      paymentIntent.authorize();
    }
    paymentIntent.capture();
    return paymentIntent;
  }

  public async refund(paymentIntentId: string): Promise<PaymentIntent> {
    const paymentIntent = this.getOrThrow(paymentIntentId);
    paymentIntent.refund();
    return paymentIntent;
  }

  public async getStatus(paymentIntentId: string): Promise<PaymentIntent> {
    return this.getOrThrow(paymentIntentId);
  }

  private getOrThrow(paymentIntentId: string): PaymentIntent {
    const paymentIntent = this.intents.get(paymentIntentId);
    if (!paymentIntent) {
      throw new Error(`No PaymentIntent found for id ${paymentIntentId}`);
    }
    return paymentIntent;
  }
}
