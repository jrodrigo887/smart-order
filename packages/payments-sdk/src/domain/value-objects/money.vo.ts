import { MoneyCurrencyMismatchError } from '../errors/money-currency-mismatch.error';

export class Money {
  private constructor(
    private readonly amountInCents: number,
    private readonly currency: string,
  ) {
    if (!Number.isInteger(amountInCents)) {
      throw new Error('Money amount must be an integer number of cents');
    }
    if (amountInCents < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!currency) {
      throw new Error('Money currency is required');
    }
  }

  public static create(amountInCents: number, currency: string): Money {
    return new Money(amountInCents, currency.toUpperCase());
  }

  public getAmountInCents(): number {
    return this.amountInCents;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public equals(other: Money): boolean {
    if (!other) return false;
    return (
      this.amountInCents === other.amountInCents &&
      this.currency === other.currency
    );
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.amountInCents + other.amountInCents, this.currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this.amountInCents - other.amountInCents, this.currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new MoneyCurrencyMismatchError(
        `Cannot operate on Money with different currencies: ${this.currency} vs ${other.currency}`,
      );
    }
  }
}
