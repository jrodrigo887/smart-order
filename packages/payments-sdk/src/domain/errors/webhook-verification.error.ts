export class WebhookVerificationError extends Error {
  constructor(message = 'Webhook payload failed verification') {
    super(message);
    this.name = 'WebhookVerificationError';
  }
}
