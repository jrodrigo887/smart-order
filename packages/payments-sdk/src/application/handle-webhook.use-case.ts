import { PaymentIntent } from '../domain/entities/payment-intent.entity';
import {
  WebhookVerifier,
  WebhookRawPayload,
  WebhookEventType,
  WebhookEventTypeType,
} from '../domain/ports/webhook-verifier.port';
import { WebhookVerificationError } from '../domain/errors/webhook-verification.error';
import { PaymentAuthorizedEvent } from '../domain/events/payment-authorized.event';
import { PaymentCapturedEvent } from '../domain/events/payment-captured.event';
import { PaymentFailedEvent } from '../domain/events/payment-failed.event';
import { PaymentRefundedEvent } from '../domain/events/payment-refunded.event';

export type PaymentWebhookEvent =
  | PaymentAuthorizedEvent
  | PaymentCapturedEvent
  | PaymentFailedEvent
  | PaymentRefundedEvent;

export class HandleWebhook {
  constructor(private readonly webhookVerifier: WebhookVerifier) {}

  public async execute(payload: WebhookRawPayload): Promise<PaymentWebhookEvent> {
    const result = await this.webhookVerifier.verify(payload);
    if (!result.valid) {
      throw new WebhookVerificationError();
    }
    return this.toDomainEvent(result.eventType, result.paymentIntent);
  }

  private toDomainEvent(
    eventType: WebhookEventTypeType,
    paymentIntent: PaymentIntent,
  ): PaymentWebhookEvent {
    switch (eventType) {
      case WebhookEventType.AUTHORIZED:
        return new PaymentAuthorizedEvent(paymentIntent);
      case WebhookEventType.CAPTURED:
        return new PaymentCapturedEvent(paymentIntent);
      case WebhookEventType.FAILED:
        return new PaymentFailedEvent(paymentIntent);
      case WebhookEventType.REFUNDED:
        return new PaymentRefundedEvent(paymentIntent);
    }
  }
}
