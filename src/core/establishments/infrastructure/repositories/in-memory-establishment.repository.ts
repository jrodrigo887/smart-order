import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Establishment } from '../../domain/entities/establishment.entity';
import { EstablishmentRepositoryContract } from '../../domain/repositories/establishment.repository.contract';

export class InMemoryEstablishmentRepository
  extends InMemoryRepository<Establishment>
  implements EstablishmentRepositoryContract
{
  async findByCompanyId(companyId: string): Promise<Establishment[]> {
    const all = await this.findAll();
    return all.filter((establishment) => establishment.companyId === companyId);
  }
}
