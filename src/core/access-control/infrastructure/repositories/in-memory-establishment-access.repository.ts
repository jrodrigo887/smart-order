import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { EstablishmentAccess } from '../../domain/entities/establishment-access.entity';
import { EstablishmentAccessRepositoryContract } from '../../domain/repositories/establishment-access.repository.contract';

export class InMemoryEstablishmentAccessRepository
  extends InMemoryRepository<EstablishmentAccess>
  implements EstablishmentAccessRepositoryContract
{
  findByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentAccess | null> {
    const found = this.getAll().find(
      (access) =>
        access.userId === userId && access.establishmentId === establishmentId,
    );
    return Promise.resolve(found ?? null);
  }
}
