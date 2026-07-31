import { Injectable } from '@nestjs/common';
import { EstablishmentAccess as EstablishmentAccessRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { EstablishmentAccessRepositoryContract } from '../../domain/repositories/establishment-access.repository.contract';
import { EstablishmentAccess } from '../../domain/entities/establishment-access.entity';

@Injectable()
export class PrismaEstablishmentAccessRepository
  implements EstablishmentAccessRepositoryContract
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<EstablishmentAccess> {
    const record = await this.prisma.establishmentAccess.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundError(`EstablishmentAccess with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<EstablishmentAccess[]> {
    const records = await this.prisma.establishmentAccess.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentAccess | null> {
    const record = await this.prisma.establishmentAccess.findUnique({
      where: { userId_establishmentId: { userId, establishmentId } },
    });
    return record ? this.toDomain(record) : null;
  }

  async create(data: EstablishmentAccess): Promise<EstablishmentAccess> {
    const record = await this.prisma.establishmentAccess.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(
    id: string,
    data: EstablishmentAccess,
  ): Promise<EstablishmentAccess> {
    const record = await this.prisma.establishmentAccess.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.establishmentAccess.delete({ where: { id } });
  }

  private toDomain(record: EstablishmentAccessRecord): EstablishmentAccess {
    return EstablishmentAccess.create({
      id: record.id,
      userId: record.userId,
      establishmentId: record.establishmentId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(establishmentAccess: EstablishmentAccess) {
    return {
      id: establishmentAccess.id,
      userId: establishmentAccess.userId,
      establishmentId: establishmentAccess.establishmentId,
    };
  }
}
