import { Injectable } from '@nestjs/common';
import { Waiter as WaiterRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { WaiterRepositoryContract } from '../../domain/repositories/waiter.repository.contract';
import { Waiter } from '../../domain/entities/waiter.entity';

@Injectable()
export class PrismaWaiterRepository implements WaiterRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Waiter> {
    const record = await this.prisma.waiter.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`Waiter with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Waiter[]> {
    const records = await this.prisma.waiter.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Waiter): Promise<Waiter> {
    const record = await this.prisma.waiter.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Waiter): Promise<Waiter> {
    const record = await this.prisma.waiter.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.waiter.delete({ where: { id } });
  }

  private toDomain(record: WaiterRecord): Waiter {
    return Waiter.create({
      id: record.id,
      name: record.name,
      restaurantId: record.restaurantId,
      userId: record.userId ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(waiter: Waiter) {
    return {
      id: waiter.id,
      name: waiter.name,
      restaurantId: waiter.restaurantId,
      userId: waiter.userId ?? null,
    };
  }
}
