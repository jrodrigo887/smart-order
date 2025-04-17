import { EntityBase } from '@/shared/entities/entity-base';
import { UuidUnique } from '@shared/vo/uuid-unique.vo';
import {
  CustomerCardStatus,
  CustomerCardStatusType,
} from '../enums/customer-card-status.enum';

export type CustomerCardProps = {
  cardNumber: number;
  waiterId: string; // uuid
  openedAt: Date;
  status: CustomerCardStatusType;
  closedAt: Date | null;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date | undefined;
};

export class CustomerCard extends EntityBase {
  private constructor(private readonly props: CustomerCardProps) {
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

  public get waiterId(): string {
    return this.props.waiterId;
  }

  public updateWaiterId(id: string): void {
    const validId = UuidUnique.create(id);
    this.props.waiterId = validId.getValue();
    this.props.updatedAt = new Date();
  }

  public get openedAt(): Date {
    return this.props.openedAt;
  }

  public get closedAt(): Date | null {
    return this.props.closedAt;
  }

  public get status(): CustomerCardStatusType {
    return this.props.status;
  }

  public close() {
    this.props.closedAt = new Date();
    this.props.updatedAt = new Date();
    this.props.status = CustomerCardStatus.CLOSED;
  }

  public isOpen(): boolean {
    return this.props.status === CustomerCardStatus.OPEN;
  }
}
