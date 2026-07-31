import { EntityBase } from '@/shared/entities/entity-base';
import { UuidUnique } from '@shared/vo/uuid-unique.vo';
import { CustomerCardStatusError } from '../errors/customer-card-status.error';
import {
  CustomerCardStatus,
  CustomerCardStatusType,
} from '../enums/customer-card-status.enum';

export type CustomerCardProps = {
  cardNumber: number;
  collaboratorId: string; // uuid
  establishmentId: string; // uuid
  openedAt: Date;
  status: CustomerCardStatusType;
  closedAt: Date | null;
  firstOrderAt?: Date | null;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
};

const CANCEL_WINDOW_MINUTES = 30;

export class CustomerCard extends EntityBase {
  private constructor(public readonly props: CustomerCardProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: CustomerCardProps): CustomerCard {
    return new CustomerCard(props);
  }

  public get cardNumber(): number {
    return this.props.cardNumber;
  }

  public get collaboratorId(): string {
    return this.props.collaboratorId;
  }

  public get establishmentId(): string {
    return this.props.establishmentId;
  }

  public updateCollaboratorId(id: string): void {
    this.assertMutable('update collaboratorId of');
    const validId = UuidUnique.create(id);
    this.props.collaboratorId = validId.getValue();
    this.props.updatedAt = new Date();
  }

  public get openedAt(): Date {
    return this.props.openedAt;
  }

  public get closedAt(): Date | null {
    return this.props.closedAt;
  }

  public get firstOrderAt(): Date | null {
    return this.props.firstOrderAt ?? null;
  }

  public get status(): CustomerCardStatusType {
    return this.props.status;
  }

  public startUsing(now: Date = new Date()): void {
    if (this.props.status !== CustomerCardStatus.OPEN) {
      throw new CustomerCardStatusError(
        `Cannot start using a CustomerCard with status ${this.props.status}`,
      );
    }
    this.props.status = CustomerCardStatus.IN_USE;
    this.props.firstOrderAt = now;
    this.props.updatedAt = now;
  }

  public close() {
    this.assertMutable('close');
    this.props.closedAt = new Date();
    this.props.updatedAt = new Date();
    this.props.status = CustomerCardStatus.CLOSED;
  }

  public cancel(now: Date = new Date()): void {
    this.assertMutable('cancel');
    if (this.props.firstOrderAt) {
      const elapsedMinutes =
        (now.getTime() - this.props.firstOrderAt.getTime()) / (60 * 1000);
      if (elapsedMinutes > CANCEL_WINDOW_MINUTES) {
        throw new CustomerCardStatusError(
          `Cannot cancel a CustomerCard more than ${CANCEL_WINDOW_MINUTES} minutes after the first Order`,
        );
      }
    }
    this.props.closedAt = now;
    this.props.updatedAt = now;
    this.props.status = CustomerCardStatus.CANCELED;
  }

  public isOpen(): boolean {
    return this.props.status === CustomerCardStatus.OPEN;
  }

  private assertMutable(action: string): void {
    if (
      this.props.status === CustomerCardStatus.CLOSED ||
      this.props.status === CustomerCardStatus.CANCELED
    ) {
      throw new CustomerCardStatusError(
        `Cannot ${action} a CustomerCard with status ${this.props.status}`,
      );
    }
  }
}
