import { PaymentIntent } from '../entities/payment-intent.entity';

export class PaymentCapturedEvent {
  constructor(public readonly paymentIntent: PaymentIntent) {}
}
