import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Collaborator } from '../entities/collaborator.entity';

export const COLLABORATOR_REPOSITORY = Symbol('COLLABORATOR_REPOSITORY');

export interface CollaboratorRepositoryContract
  extends RepositoryContract<Collaborator> {
  findByEstablishmentId(establishmentId: string): Promise<Collaborator[]>;
}
