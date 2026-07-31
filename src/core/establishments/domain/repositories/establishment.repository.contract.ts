import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Establishment } from '../entities/establishment.entity';

export const ESTABLISHMENT_REPOSITORY = Symbol('ESTABLISHMENT_REPOSITORY');

export interface EstablishmentRepositoryContract
  extends RepositoryContract<Establishment> {
  findByCompanyId(companyId: string): Promise<Establishment[]>;
}
