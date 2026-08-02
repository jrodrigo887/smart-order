import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuRepositoryContract } from '../../domain/repositories/menu.repository.contract';

export class InMemoryMenuRepository
  extends InMemoryRepository<Menu>
  implements MenuRepositoryContract
{
  findByEstablishmentId(establishmentId: string): Promise<Menu[]> {
    return Promise.resolve(
      this.getAll().filter((menu) => menu.establishmentId === establishmentId),
    );
  }
}
