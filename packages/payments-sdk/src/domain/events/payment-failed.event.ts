import { PaymentIntent } from '../entities/payment-intent.entity';

export class PaymentFailedEvent {
  constructor(public readonly paymentIntent: PaymentIntent) {}
}
