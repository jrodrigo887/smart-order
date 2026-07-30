import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  PAYMENT_GATEWAY,
  PaymentGateway,
} from '../domain/ports/payment-gateway.port';
import {
  CREDENTIALS_PROVIDER,
  CredentialsProvider,
} from '../domain/ports/credentials-provider.port';
import {
  WEBHOOK_VERIFIER,
  WebhookVerifier,
} from '../domain/ports/webhook-verifier.port';
import { CreatePaymentIntent } from '../application/create-payment-intent.use-case';
import { CapturePayment } from '../application/capture-payment.use-case';
import { RefundPayment } from '../application/refund-payment.use-case';
import { HandleWebhook } from '../application/handle-webhook.use-case';

export type PortImplementation<T> = { useClass: Type<T> } | { useValue: T };

export type PaymentsModuleOptions = {
  paymentGateway: PortImplementation<PaymentGateway>;
  credentialsProvider: PortImplementation<CredentialsProvider>;
  webhookVerifier: PortImplementation<WebhookVerifier>;
};

@Module({})
export class PaymentsModule {
  public static register(options: PaymentsModuleOptions): DynamicModule {
    const portProviders: Provider[] = [
      { provide: PAYMENT_GATEWAY, ...options.paymentGateway },
      { provide: CREDENTIALS_PROVIDER, ...options.credentialsProvider },
      { provide: WEBHOOK_VERIFIER, ...options.webhookVerifier },
    ];

    const useCaseProviders: Provider[] = [
      {
        provide: CreatePaymentIntent,
        useFactory: (
          gateway: PaymentGateway,
          credentialsProvider: CredentialsProvider,
        ) => new CreatePaymentIntent(gateway, credentialsProvider),
        inject: [PAYMENT_GATEWAY, CREDENTIALS_PROVIDER],
      },
      {
        provide: CapturePayment,
        useFactory: (gateway: PaymentGateway) => new CapturePayment(gateway),
        inject: [PAYMENT_GATEWAY],
      },
      {
        provide: RefundPayment,
        useFactory: (gateway: PaymentGateway) => new RefundPayment(gateway),
        inject: [PAYMENT_GATEWAY],
      },
      {
        provide: HandleWebhook,
        useFactory: (verifier: WebhookVerifier) => new HandleWebhook(verifier),
        inject: [WEBHOOK_VERIFIER],
      },
    ];

    return {
      module: PaymentsModule,
      providers: [...portProviders, ...useCaseProviders],
      exports: [
        PAYMENT_GATEWAY,
        CREDENTIALS_PROVIDER,
        WEBHOOK_VERIFIER,
        CreatePaymentIntent,
        CapturePayment,
        RefundPayment,
        HandleWebhook,
      ],
    };
  }
}
