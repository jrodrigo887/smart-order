import { Money } from '../value-objects/money.vo';
import { PaymentIntent } from '../entities/payment-intent.entity';

export type CreatePaymentIntentParams = {
  amount: Money;
  provider: string;
  externalReference?: string;
  metadata?: Record<string, unknown>;
  credentials: unknown;
};

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface PaymentGateway {
  create(params: CreatePaymentIntentParams): Promise<PaymentIntent>;
  capture(paymentIntentId: string): Promise<PaymentIntent>;
  refund(paymentIntentId: string): Promise<PaymentIntent>;
  getStatus(paymentIntentId: string): Promise<PaymentIntent>;
}
