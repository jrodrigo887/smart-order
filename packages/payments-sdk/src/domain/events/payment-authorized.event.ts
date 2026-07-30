import { PaymentIntent } from '../entities/payment-intent.entity';

export class PaymentAuthorizedEvent {
  constructor(public readonly paymentIntent: PaymentIntent) {}
}
