import { Injectable } from '@nestjs/common';
import { Product as ProductRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { ProductRepositoryContract } from '../../domain/repositories/product.repository.contract';
import { Product } from '../../domain/entities/product.entity';
import { ProductStatusType } from '../../domain/enums/product-status.enum';

@Injectable()
export class PrismaProductRepository implements ProductRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product> {
    const record = await this.prisma.product.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`Product with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Product[]> {
    const records = await this.prisma.product.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByEstablishmentId(establishmentId: string): Promise<Product[]> {
    const records = await this.prisma.product.findMany({
      where: { establishmentId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Product): Promise<Product> {
    const record = await this.prisma.product.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Product): Promise<Product> {
    const record = await this.prisma.product.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  private toDomain(record: ProductRecord): Product {
    return Product.create({
      id: record.id,
      establishmentId: record.establishmentId,
      categoryId: record.categoryId,
      name: record.name,
      description: record.description ?? undefined,
      sku: record.sku ?? undefined,
      basePrice: record.basePrice.toNumber(),
      tags: record.tags,
      status: record.status as ProductStatusType,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(product: Product) {
    return {
      id: product.id,
      establishmentId: product.establishmentId,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description ?? null,
      sku: product.sku ?? null,
      basePrice: product.basePrice,
      tags: product.tags,
      status: product.status,
    };
  }
}
