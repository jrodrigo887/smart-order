import { EntityBase } from '@/shared/entities/entity-base';
import { CompanyRoleTypeType } from '../enums/company-role-type.enum';

export type CompanyRoleProps = {
  userId: string;
  companyId: string;
  role: CompanyRoleTypeType;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class CompanyRole extends EntityBase {
  private constructor(public readonly props: CompanyRoleProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }

  public static create(props: CompanyRoleProps): CompanyRole {
    return new CompanyRole(props);
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get companyId(): string {
    return this.props.companyId;
  }

  public get role(): CompanyRoleTypeType {
    return this.props.role;
  }
}
