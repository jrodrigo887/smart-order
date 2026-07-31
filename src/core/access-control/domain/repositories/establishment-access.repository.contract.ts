import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { EstablishmentAccess } from '../entities/establishment-access.entity';

export const ESTABLISHMENT_ACCESS_REPOSITORY = Symbol(
  'ESTABLISHMENT_ACCESS_REPOSITORY',
);

export type EstablishmentAccessRepositoryContract =
  RepositoryContract<EstablishmentAccess>;
