import { PaymentIntent } from '../payment-intent.entity';
import { PaymentStatus } from '../../enums/payment-status.enum';
import { PaymentIntentStatusError } from '../../errors/payment-intent-status.error';
import { Money } from '../../value-objects/money.vo';

function createPendingIntent(): PaymentIntent {
  return PaymentIntent.create({
    amount: Money.create(1000, 'BRL'),
    provider: 'noop',
  });
}

describe('PaymentIntent', () => {
  it('starts as PENDING by default', () => {
    const intent = createPendingIntent();
    expect(intent.status).toBe(PaymentStatus.PENDING);
  });

  it('authorizes from PENDING', () => {
    const intent = createPendingIntent();
    intent.authorize();
    expect(intent.status).toBe(PaymentStatus.AUTHORIZED);
  });

  it('rejects authorizing twice', () => {
    const intent = createPendingIntent();
    intent.authorize();
    expect(() => intent.authorize()).toThrow(PaymentIntentStatusError);
  });

  it('captures from PENDING or AUTHORIZED', () => {
    const fromPending = createPendingIntent();
    fromPending.capture();
    expect(fromPending.status).toBe(PaymentStatus.CAPTURED);

    const fromAuthorized = createPendingIntent();
    fromAuthorized.authorize();
    fromAuthorized.capture();
    expect(fromAuthorized.status).toBe(PaymentStatus.CAPTURED);
  });

  it('rejects capturing an already captured intent', () => {
    const intent = createPendingIntent();
    intent.capture();
    expect(() => intent.capture()).toThrow(PaymentIntentStatusError);
  });

  it('fails from PENDING or AUTHORIZED', () => {
    const intent = createPendingIntent();
    intent.fail();
    expect(intent.status).toBe(PaymentStatus.FAILED);
  });

  it('rejects failing a captured intent', () => {
    const intent = createPendingIntent();
    intent.capture();
    expect(() => intent.fail()).toThrow(PaymentIntentStatusError);
  });

  it('refunds only from CAPTURED', () => {
    const intent = createPendingIntent();
    expect(() => intent.refund()).toThrow(PaymentIntentStatusError);
    intent.capture();
    intent.refund();
    expect(intent.status).toBe(PaymentStatus.REFUNDED);
  });

  it('rejects refunding twice', () => {
    const intent = createPendingIntent();
    intent.capture();
    intent.refund();
    expect(() => intent.refund()).toThrow(PaymentIntentStatusError);
  });

  it('cancels from PENDING or AUTHORIZED', () => {
    const intent = createPendingIntent();
    intent.cancel();
    expect(intent.status).toBe(PaymentStatus.CANCELED);
  });

  it('rejects cancelling a captured intent', () => {
    const intent = createPendingIntent();
    intent.capture();
    expect(() => intent.cancel()).toThrow(PaymentIntentStatusError);
  });
});
