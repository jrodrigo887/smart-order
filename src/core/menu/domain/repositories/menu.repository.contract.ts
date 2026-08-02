import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Menu } from '../entities/menu.entity';

export const MENU_REPOSITORY = Symbol('MENU_REPOSITORY');

export interface MenuRepositoryContract extends RepositoryContract<Menu> {
  findByEstablishmentId(establishmentId: string): Promise<Menu[]>;
}
