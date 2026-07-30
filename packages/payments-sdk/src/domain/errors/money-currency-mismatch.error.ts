export class MoneyCurrencyMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MoneyCurrencyMismatchError';
  }
}
