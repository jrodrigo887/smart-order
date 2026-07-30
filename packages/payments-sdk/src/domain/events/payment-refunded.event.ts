import { PaymentIntent } from '../entities/payment-intent.entity';

export class PaymentRefundedEvent {
  constructor(public readonly paymentIntent: PaymentIntent) {}
}
