import { PaymentGateway } from '../domain/ports/payment-gateway.port';
import { PaymentRefundedEvent } from '../domain/events/payment-refunded.event';

export class RefundPayment {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  public async execute(paymentIntentId: string): Promise<PaymentRefundedEvent> {
    const paymentIntent = await this.paymentGateway.refund(paymentIntentId);
    return new PaymentRefundedEvent(paymentIntent);
  }
}
