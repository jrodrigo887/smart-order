import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Establishment } from '../../domain/entities/establishment.entity';
import { EstablishmentRepositoryContract } from '../../domain/repositories/establishment.repository.contract';

export class InMemoryEstablishmentRepository
  extends InMemoryRepository<Establishment>
  implements EstablishmentRepositoryContract
{
  findByCompanyId(companyId: string): Promise<Establishment[]> {
    return Promise.resolve(
      this.getAll().filter(
        (establishment) => establishment.companyId === companyId,
      ),
    );
  }
}
