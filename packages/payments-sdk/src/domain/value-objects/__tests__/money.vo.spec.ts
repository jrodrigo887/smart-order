import { Money } from '../money.vo';
import { MoneyCurrencyMismatchError } from '../../errors/money-currency-mismatch.error';

describe('Money', () => {
  it('creates a value in integer cents', () => {
    const money = Money.create(1050, 'BRL');
    expect(money.getAmountInCents()).toBe(1050);
    expect(money.getCurrency()).toBe('BRL');
  });

  it('normalizes currency to uppercase', () => {
    const money = Money.create(100, 'brl');
    expect(money.getCurrency()).toBe('BRL');
  });

  it('rejects non-integer amounts', () => {
    expect(() => Money.create(10.5, 'BRL')).toThrow(
      'Money amount must be an integer number of cents',
    );
  });

  it('rejects negative amounts', () => {
    expect(() => Money.create(-100, 'BRL')).toThrow(
      'Money amount cannot be negative',
    );
  });

  it('compares equality by amount and currency', () => {
    const a = Money.create(500, 'BRL');
    const b = Money.create(500, 'BRL');
    const c = Money.create(500, 'USD');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });

  it('adds amounts of the same currency', () => {
    const a = Money.create(500, 'BRL');
    const b = Money.create(250, 'BRL');
    expect(a.add(b).getAmountInCents()).toBe(750);
  });

  it('guards against operating on different currencies', () => {
    const a = Money.create(500, 'BRL');
    const b = Money.create(250, 'USD');
    expect(() => a.add(b)).toThrow(MoneyCurrencyMismatchError);
    expect(() => a.subtract(b)).toThrow(MoneyCurrencyMismatchError);
  });
});
