import { PaymentIntent } from '../entities/payment-intent.entity';

export type WebhookRawPayload = {
  body: string | Buffer;
  headers: Record<string, string>;
};

export const WebhookEventType = {
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type WebhookEventTypeType =
  (typeof WebhookEventType)[keyof typeof WebhookEventType];

export type WebhookVerificationResult =
  | {
      valid: true;
      eventType: WebhookEventTypeType;
      paymentIntent: PaymentIntent;
    }
  | {
      valid: false;
    };

export const WEBHOOK_VERIFIER = Symbol('WEBHOOK_VERIFIER');

export interface WebhookVerifier {
  verify(payload: WebhookRawPayload): Promise<WebhookVerificationResult>;
}
