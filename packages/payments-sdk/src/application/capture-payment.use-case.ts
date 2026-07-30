import { PaymentGateway } from '../domain/ports/payment-gateway.port';
import { PaymentStatus } from '../domain/enums/payment-status.enum';
import { PaymentCapturedEvent } from '../domain/events/payment-captured.event';
import { PaymentFailedEvent } from '../domain/events/payment-failed.event';

export class CapturePayment {
  constructor(private readonly paymentGateway: PaymentGateway) {}

  public async execute(
    paymentIntentId: string,
  ): Promise<PaymentCapturedEvent | PaymentFailedEvent> {
    const paymentIntent = await this.paymentGateway.capture(paymentIntentId);
    if (paymentIntent.status === PaymentStatus.CAPTURED) {
      return new PaymentCapturedEvent(paymentIntent);
    }
    return new PaymentFailedEvent(paymentIntent);
  }
}
