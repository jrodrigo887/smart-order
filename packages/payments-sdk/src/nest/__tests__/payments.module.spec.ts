import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { PaymentsModule } from '../payments.module';
import { NoopPaymentGateway } from '../../adapters/noop-payment-gateway.adapter';
import { CredentialsProvider } from '../../domain/ports/credentials-provider.port';
import { WebhookVerifier } from '../../domain/ports/webhook-verifier.port';
import { CreatePaymentIntent } from '../../application/create-payment-intent.use-case';
import { CapturePayment } from '../../application/capture-payment.use-case';
import { RefundPayment } from '../../application/refund-payment.use-case';
import { HandleWebhook } from '../../application/handle-webhook.use-case';
import { PAYMENT_GATEWAY } from '../../domain/ports/payment-gateway.port';

class FakeCredentialsProvider implements CredentialsProvider {
  async resolve(): Promise<unknown | null> {
    return { apiKey: 'secret' };
  }
}

class FakeWebhookVerifier implements WebhookVerifier {
  async verify(): Promise<never> {
    throw new Error('not used in this test');
  }
}

describe('PaymentsModule', () => {
  it('compiles and resolves the use-case providers', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PaymentsModule.register({
          paymentGateway: { useClass: NoopPaymentGateway },
          credentialsProvider: { useClass: FakeCredentialsProvider },
          webhookVerifier: { useClass: FakeWebhookVerifier },
        }),
      ],
    }).compile();

    expect(moduleRef.get(CreatePaymentIntent)).toBeInstanceOf(CreatePaymentIntent);
    expect(moduleRef.get(CapturePayment)).toBeInstanceOf(CapturePayment);
    expect(moduleRef.get(RefundPayment)).toBeInstanceOf(RefundPayment);
    expect(moduleRef.get(HandleWebhook)).toBeInstanceOf(HandleWebhook);
    expect(moduleRef.get(PAYMENT_GATEWAY)).toBeInstanceOf(NoopPaymentGateway);
  });
});
