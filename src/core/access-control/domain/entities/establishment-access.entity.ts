import { EntityBase } from '@/shared/entities/entity-base';

export type EstablishmentAccessProps = {
  userId: string;
  establishmentId: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class EstablishmentAccess extends EntityBase {
  private constructor(public readonly props: EstablishmentAccessProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: EstablishmentAccessProps): EstablishmentAccess {
    return new EstablishmentAccess(props);
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get establishmentId(): string {
    return this.props.establishmentId;
  }
}
