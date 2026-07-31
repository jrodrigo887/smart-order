import { EntityBase } from '@/shared/entities/entity-base';

export type CompanyProps = {
  cnpj: string;
  corporateName: string;
  tradeName: string;
  address: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Company extends EntityBase {
  private constructor(public readonly props: CompanyProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: CompanyProps): Company {
    return new Company(props);
  }

  public get cnpj(): string {
    return this.props.cnpj;
  }

  public get corporateName(): string {
    return this.props.corporateName;
  }

  public get tradeName(): string {
    return this.props.tradeName;
  }

  public get address(): string {
    return this.props.address;
  }
}
