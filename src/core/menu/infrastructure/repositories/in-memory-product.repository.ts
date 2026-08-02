import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepositoryContract } from '../../domain/repositories/product.repository.contract';

export class InMemoryProductRepository
  extends InMemoryRepository<Product>
  implements ProductRepositoryContract
{
  findByEstablishmentId(establishmentId: string): Promise<Product[]> {
    return Promise.resolve(
      this.getAll().filter(
        (product) => product.establishmentId === establishmentId,
      ),
    );
  }
}
