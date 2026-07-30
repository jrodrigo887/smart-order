import { CapturePayment } from '../capture-payment.use-case';
import { NoopPaymentGateway } from '../../adapters/noop-payment-gateway.adapter';
import { PaymentGateway } from '../../domain/ports/payment-gateway.port';
import { PaymentIntent } from '../../domain/entities/payment-intent.entity';
import { PaymentCapturedEvent } from '../../domain/events/payment-captured.event';
import { PaymentFailedEvent } from '../../domain/events/payment-failed.event';
import { Money } from '../../domain/value-objects/money.vo';

describe('CapturePayment', () => {
  it('emits PaymentCapturedEvent when the gateway captures successfully', async () => {
    const gateway = new NoopPaymentGateway();
    const created = await gateway.create({
      amount: Money.create(1000, 'BRL'),
      provider: 'noop',
      credentials: {},
    });

    const useCase = new CapturePayment(gateway);
    const event = await useCase.execute(created.id);

    expect(event).toBeInstanceOf(PaymentCapturedEvent);
    expect((event as PaymentCapturedEvent).paymentIntent.id).toBe(created.id);
  });

  it('emits PaymentFailedEvent when the gateway does not report CAPTURED', async () => {
    const failedIntent = PaymentIntent.create({
      amount: Money.create(1000, 'BRL'),
      provider: 'noop',
    });
    failedIntent.fail();

    const gateway: PaymentGateway = {
      create: jest.fn(),
      capture: jest.fn().mockResolvedValue(failedIntent),
      refund: jest.fn(),
      getStatus: jest.fn(),
    };

    const useCase = new CapturePayment(gateway);
    const event = await useCase.execute(failedIntent.id);

    expect(event).toBeInstanceOf(PaymentFailedEvent);
  });
});
