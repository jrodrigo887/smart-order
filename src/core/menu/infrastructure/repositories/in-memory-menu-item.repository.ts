import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { MenuItemRepositoryContract } from '../../domain/repositories/menu-item.repository.contract';

export class InMemoryMenuItemRepository
  extends InMemoryRepository<MenuItem>
  implements MenuItemRepositoryContract
{
  findByMenuId(menuId: string): Promise<MenuItem[]> {
    return Promise.resolve(
      this.getAll().filter((menuItem) => menuItem.menuId === menuId),
    );
  }
}
