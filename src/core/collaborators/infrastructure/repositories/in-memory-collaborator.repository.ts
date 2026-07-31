import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Collaborator } from '../../domain/entities/collaborator.entity';
import { CollaboratorRepositoryContract } from '../../domain/repositories/collaborator.repository.contract';

export class InMemoryCollaboratorRepository
  extends InMemoryRepository<Collaborator>
  implements CollaboratorRepositoryContract
{
  findByEstablishmentId(establishmentId: string): Promise<Collaborator[]> {
    return Promise.resolve(
      this.getAll().filter(
        (collaborator) => collaborator.establishmentId === establishmentId,
      ),
    );
  }
}
