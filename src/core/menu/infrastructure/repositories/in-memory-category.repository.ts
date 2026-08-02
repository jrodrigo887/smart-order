import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepositoryContract } from '../../domain/repositories/category.repository.contract';

export class InMemoryCategoryRepository
  extends InMemoryRepository<Category>
  implements CategoryRepositoryContract
{
  findByEstablishmentId(establishmentId: string): Promise<Category[]> {
    return Promise.resolve(
      this.getAll().filter(
        (category) => category.establishmentId === establishmentId,
      ),
    );
  }
}
