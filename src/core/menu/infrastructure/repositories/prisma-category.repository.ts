import { Injectable } from '@nestjs/common';
import { Category as CategoryRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { CategoryRepositoryContract } from '../../domain/repositories/category.repository.contract';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Category> {
    const record = await this.prisma.category.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`Category with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Category[]> {
    const records = await this.prisma.category.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByEstablishmentId(establishmentId: string): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      where: { establishmentId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Category): Promise<Category> {
    const record = await this.prisma.category.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Category): Promise<Category> {
    const record = await this.prisma.category.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  private toDomain(record: CategoryRecord): Category {
    return Category.create({
      id: record.id,
      establishmentId: record.establishmentId,
      name: record.name,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(category: Category) {
    return {
      id: category.id,
      establishmentId: category.establishmentId,
      name: category.name,
    };
  }
}
