import { Inject, Injectable } from '@nestjs/common';
import { Menu } from '../domain/entities/menu.entity';
import {
  MENU_REPOSITORY,
  MenuRepositoryContract,
} from '../domain/repositories/menu.repository.contract';

export type CreateMenuInput = {
  establishmentId: string;
  name: string;
};

@Injectable()
export class MenusService {
  constructor(
    @Inject(MENU_REPOSITORY)
    private readonly repository: MenuRepositoryContract,
  ) {}

  async create(input: CreateMenuInput): Promise<Menu> {
    const menu = Menu.create(input);
    return this.repository.create(menu);
  }

  async findById(id: string): Promise<Menu> {
    return this.repository.findById(id);
  }

  async listByEstablishment(establishmentId: string): Promise<Menu[]> {
    return this.repository.findByEstablishmentId(establishmentId);
  }

  async activate(id: string): Promise<Menu> {
    const menu = await this.repository.findById(id);
    menu.activate();
    return this.repository.update(id, menu);
  }

  async deactivate(id: string): Promise<Menu> {
    const menu = await this.repository.findById(id);
    menu.deactivate();
    return this.repository.update(id, menu);
  }
}
