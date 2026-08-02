import { Injectable } from '@nestjs/common';
import { MenuItem as MenuItemRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { MenuItemRepositoryContract } from '../../domain/repositories/menu-item.repository.contract';
import { MenuItem } from '../../domain/entities/menu-item.entity';
import { MenuItemStatusType } from '../../domain/enums/menu-item-status.enum';

@Injectable()
export class PrismaMenuItemRepository implements MenuItemRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MenuItem> {
    const record = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`MenuItem with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<MenuItem[]> {
    const records = await this.prisma.menuItem.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByMenuId(menuId: string): Promise<MenuItem[]> {
    const records = await this.prisma.menuItem.findMany({
      where: { menuId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async create(data: MenuItem): Promise<MenuItem> {
    const record = await this.prisma.menuItem.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: MenuItem): Promise<MenuItem> {
    const record = await this.prisma.menuItem.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menuItem.delete({ where: { id } });
  }

  private toDomain(record: MenuItemRecord): MenuItem {
    return MenuItem.create({
      id: record.id,
      menuId: record.menuId,
      productId: record.productId,
      price: record.price.toNumber(),
      status: record.status as MenuItemStatusType,
      displayOrder: record.displayOrder,
      featured: record.featured,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(menuItem: MenuItem) {
    return {
      id: menuItem.id,
      menuId: menuItem.menuId,
      productId: menuItem.productId,
      price: menuItem.price,
      status: menuItem.status,
      displayOrder: menuItem.displayOrder,
      featured: menuItem.featured,
    };
  }
}
