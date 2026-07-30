export class UnauthorizedCancellationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedCancellationError';
  }
}
