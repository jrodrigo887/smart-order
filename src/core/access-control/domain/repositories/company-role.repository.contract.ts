import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { CompanyRole } from '../entities/company-role.entity';

export const COMPANY_ROLE_REPOSITORY = Symbol('COMPANY_ROLE_REPOSITORY');

export interface CompanyRoleRepositoryContract
  extends RepositoryContract<CompanyRole> {
  findByUserAndCompany(
    userId: string,
    companyId: string,
  ): Promise<CompanyRole | null>;
}
