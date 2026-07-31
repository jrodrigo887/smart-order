import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Company } from '../entities/company.entity';

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');

export type CompanyRepositoryContract = RepositoryContract<Company>;
