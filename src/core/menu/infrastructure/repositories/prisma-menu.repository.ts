import { Injectable } from '@nestjs/common';
import { Menu as MenuRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { MenuRepositoryContract } from '../../domain/repositories/menu.repository.contract';
import { Menu } from '../../domain/entities/menu.entity';
import { MenuStatusType } from '../../domain/enums/menu-status.enum';

@Injectable()
export class PrismaMenuRepository implements MenuRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Menu> {
    const record = await this.prisma.menu.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`Menu with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Menu[]> {
    const records = await this.prisma.menu.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByEstablishmentId(establishmentId: string): Promise<Menu[]> {
    const records = await this.prisma.menu.findMany({
      where: { establishmentId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Menu): Promise<Menu> {
    const record = await this.prisma.menu.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Menu): Promise<Menu> {
    const record = await this.prisma.menu.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({ where: { id } });
  }

  private toDomain(record: MenuRecord): Menu {
    return Menu.create({
      id: record.id,
      establishmentId: record.establishmentId,
      name: record.name,
      status: record.status as MenuStatusType,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(menu: Menu) {
    return {
      id: menu.id,
      establishmentId: menu.establishmentId,
      name: menu.name,
      status: menu.status,
    };
  }
}
