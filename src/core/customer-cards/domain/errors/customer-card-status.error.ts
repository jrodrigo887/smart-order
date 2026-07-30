export class CustomerCardStatusError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerCardStatusError';
  }
}
