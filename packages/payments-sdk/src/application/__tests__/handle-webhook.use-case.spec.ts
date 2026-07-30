import { HandleWebhook } from '../handle-webhook.use-case';
import {
  WebhookVerifier,
  WebhookEventType,
  WebhookRawPayload,
  WebhookVerificationResult,
} from '../../domain/ports/webhook-verifier.port';
import { WebhookVerificationError } from '../../domain/errors/webhook-verification.error';
import { PaymentAuthorizedEvent } from '../../domain/events/payment-authorized.event';
import { PaymentCapturedEvent } from '../../domain/events/payment-captured.event';
import { PaymentFailedEvent } from '../../domain/events/payment-failed.event';
import { PaymentRefundedEvent } from '../../domain/events/payment-refunded.event';
import { PaymentIntent } from '../../domain/entities/payment-intent.entity';
import { Money } from '../../domain/value-objects/money.vo';

const payload: WebhookRawPayload = { body: '{}', headers: {} };

function verifierReturning(result: WebhookVerificationResult): WebhookVerifier {
  return { verify: jest.fn().mockResolvedValue(result) };
}

function samplePaymentIntent(): PaymentIntent {
  return PaymentIntent.create({
    amount: Money.create(1000, 'BRL'),
    provider: 'noop',
  });
}

describe('HandleWebhook', () => {
  it.each([
    [WebhookEventType.AUTHORIZED, PaymentAuthorizedEvent],
    [WebhookEventType.CAPTURED, PaymentCapturedEvent],
    [WebhookEventType.FAILED, PaymentFailedEvent],
    [WebhookEventType.REFUNDED, PaymentRefundedEvent],
  ])('maps a valid %s webhook to the matching domain event', async (eventType, EventClass) => {
    const paymentIntent = samplePaymentIntent();
    const verifier = verifierReturning({
      valid: true,
      eventType,
      paymentIntent,
    });

    const useCase = new HandleWebhook(verifier);
    const event = await useCase.execute(payload);

    expect(event).toBeInstanceOf(EventClass);
    expect(event.paymentIntent).toBe(paymentIntent);
  });

  it('rejects a payload that fails verification without emitting an event', async () => {
    const verifier = verifierReturning({ valid: false });
    const useCase = new HandleWebhook(verifier);

    await expect(useCase.execute(payload)).rejects.toThrow(
      WebhookVerificationError,
    );
  });
});
