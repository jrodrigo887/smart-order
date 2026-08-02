import { Inject, Injectable } from '@nestjs/common';
import { MenuItem } from '../domain/entities/menu-item.entity';
import {
  MENU_ITEM_REPOSITORY,
  MenuItemRepositoryContract,
} from '../domain/repositories/menu-item.repository.contract';

export type AddMenuItemInput = {
  menuId: string;
  productId: string;
  price: number;
  displayOrder?: number;
  featured?: boolean;
};

export type UpdateMenuItemInput = {
  price?: number;
  displayOrder?: number;
  featured?: boolean;
};

@Injectable()
export class MenuItemsService {
  constructor(
    @Inject(MENU_ITEM_REPOSITORY)
    private readonly repository: MenuItemRepositoryContract,
  ) {}

  async add(input: AddMenuItemInput): Promise<MenuItem> {
    const menuItem = MenuItem.create(input);
    return this.repository.create(menuItem);
  }

  async listByMenu(menuId: string): Promise<MenuItem[]> {
    return this.repository.findByMenuId(menuId);
  }

  async update(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const menuItem = await this.repository.findById(id);
    if (input.price !== undefined) {
      menuItem.updatePrice(input.price);
    }
    if (input.displayOrder !== undefined || input.featured !== undefined) {
      menuItem.updateDisplay(
        input.displayOrder ?? menuItem.displayOrder,
        input.featured ?? menuItem.featured,
      );
    }
    return this.repository.update(id, menuItem);
  }

  async markAvailable(id: string): Promise<MenuItem> {
    const menuItem = await this.repository.findById(id);
    menuItem.markAvailable();
    return this.repository.update(id, menuItem);
  }

  async markUnavailable(id: string): Promise<MenuItem> {
    const menuItem = await this.repository.findById(id);
    menuItem.markUnavailable();
    return this.repository.update(id, menuItem);
  }
}
