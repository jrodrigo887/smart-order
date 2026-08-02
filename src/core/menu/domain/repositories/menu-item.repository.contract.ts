import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { MenuItem } from '../entities/menu-item.entity';

export const MENU_ITEM_REPOSITORY = Symbol('MENU_ITEM_REPOSITORY');

export interface MenuItemRepositoryContract
  extends RepositoryContract<MenuItem> {
  findByMenuId(menuId: string): Promise<MenuItem[]>;
}
