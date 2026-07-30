import { v4 as uuidv4 } from 'uuid';
import { Money } from '../value-objects/money.vo';
import { PaymentStatus, PaymentStatusType } from '../enums/payment-status.enum';
import { PaymentIntentStatusError } from '../errors/payment-intent-status.error';

export type PaymentIntentProps = {
  amount: Money;
  provider: string;
  status?: PaymentStatusType;
  externalReference?: string;
  metadata?: Record<string, unknown>;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type PaymentIntentState = {
  id: string;
  amount: Money;
  provider: string;
  status: PaymentStatusType;
  externalReference?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

const CAPTURABLE_STATUSES: PaymentStatusType[] = [
  PaymentStatus.PENDING,
  PaymentStatus.AUTHORIZED,
];
const FAILABLE_STATUSES: PaymentStatusType[] = [
  PaymentStatus.PENDING,
  PaymentStatus.AUTHORIZED,
];
const CANCELABLE_STATUSES: PaymentStatusType[] = [
  PaymentStatus.PENDING,
  PaymentStatus.AUTHORIZED,
];

export class PaymentIntent {
  private constructor(private readonly props: PaymentIntentState) {}

  public static create(props: PaymentIntentProps): PaymentIntent {
    return new PaymentIntent({
      id: props.id ?? uuidv4(),
      amount: props.amount,
      provider: props.provider,
      status: props.status ?? PaymentStatus.PENDING,
      externalReference: props.externalReference,
      metadata: props.metadata,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  public get id(): string {
    return this.props.id;
  }

  public get amount(): Money {
    return this.props.amount;
  }

  public get provider(): string {
    return this.props.provider;
  }

  public get status(): PaymentStatusType {
    return this.props.status;
  }

  public get externalReference(): string | undefined {
    return this.props.externalReference;
  }

  public get metadata(): Record<string, unknown> | undefined {
    return this.props.metadata;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public authorize(): void {
    if (this.props.status !== PaymentStatus.PENDING) {
      throw new PaymentIntentStatusError(
        `Cannot authorize a PaymentIntent with status ${this.props.status}`,
      );
    }
    this.transitionTo(PaymentStatus.AUTHORIZED);
  }

  public capture(): void {
    if (!CAPTURABLE_STATUSES.includes(this.props.status)) {
      throw new PaymentIntentStatusError(
        `Cannot capture a PaymentIntent with status ${this.props.status}`,
      );
    }
    this.transitionTo(PaymentStatus.CAPTURED);
  }

  public fail(): void {
    if (!FAILABLE_STATUSES.includes(this.props.status)) {
      throw new PaymentIntentStatusError(
        `Cannot fail a PaymentIntent with status ${this.props.status}`,
      );
    }
    this.transitionTo(PaymentStatus.FAILED);
  }

  public refund(): void {
    if (this.props.status !== PaymentStatus.CAPTURED) {
      throw new PaymentIntentStatusError(
        `Cannot refund a PaymentIntent with status ${this.props.status}`,
      );
    }
    this.transitionTo(PaymentStatus.REFUNDED);
  }

  public cancel(): void {
    if (!CANCELABLE_STATUSES.includes(this.props.status)) {
      throw new PaymentIntentStatusError(
        `Cannot cancel a PaymentIntent with status ${this.props.status}`,
      );
    }
    this.transitionTo(PaymentStatus.CANCELED);
  }

  private transitionTo(status: PaymentStatusType): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }
}
