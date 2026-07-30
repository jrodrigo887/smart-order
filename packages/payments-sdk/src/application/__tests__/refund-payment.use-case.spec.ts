import { RefundPayment } from '../refund-payment.use-case';
import { NoopPaymentGateway } from '../../adapters/noop-payment-gateway.adapter';
import { PaymentRefundedEvent } from '../../domain/events/payment-refunded.event';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { Money } from '../../domain/value-objects/money.vo';

describe('RefundPayment', () => {
  it('emits PaymentRefundedEvent after refunding a captured intent', async () => {
    const gateway = new NoopPaymentGateway();
    const created = await gateway.create({
      amount: Money.create(1000, 'BRL'),
      provider: 'noop',
      credentials: {},
    });
    await gateway.capture(created.id);

    const useCase = new RefundPayment(gateway);
    const event = await useCase.execute(created.id);

    expect(event).toBeInstanceOf(PaymentRefundedEvent);
    expect(event.paymentIntent.status).toBe(PaymentStatus.REFUNDED);
  });
});
