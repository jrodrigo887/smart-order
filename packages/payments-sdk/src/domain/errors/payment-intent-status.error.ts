export class PaymentIntentStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentIntentStatusError';
  }
}
