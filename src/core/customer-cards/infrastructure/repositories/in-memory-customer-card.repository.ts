import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { CustomerCard } from '../../domain/entities/customer-card.entity';
import { CustomerCardRepositoryContract } from '../../domain/repositories/customer-card.repository.contract';

export class InMemoryCustomerCardRepository
  extends InMemoryRepository<CustomerCard>
  implements CustomerCardRepositoryContract
{
  findByEstablishmentId(establishmentId: string): Promise<CustomerCard[]> {
    return Promise.resolve(
      this.getAll().filter((card) => card.establishmentId === establishmentId),
    );
  }
}
