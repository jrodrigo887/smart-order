import { EntityBase } from '@/shared/entities/entity-base';
import { EstablishmentUnitTypeType } from '../enums/establishment-unit-type.enum';

export type EstablishmentProps = {
  companyId: string;
  name: string;
  unitType: EstablishmentUnitTypeType;
  address: string;
  cnpj?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Establishment extends EntityBase {
  private constructor(public readonly props: EstablishmentProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: EstablishmentProps): Establishment {
    return new Establishment(props);
  }

  public get companyId(): string {
    return this.props.companyId;
  }

  public get name(): string {
    return this.props.name;
  }

  public get unitType(): EstablishmentUnitTypeType {
    return this.props.unitType;
  }

  public get address(): string {
    return this.props.address;
  }

  public get cnpj(): string | undefined {
    return this.props.cnpj;
  }
}
