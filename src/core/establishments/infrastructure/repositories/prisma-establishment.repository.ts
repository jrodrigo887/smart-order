import { Injectable } from '@nestjs/common';
import { Establishment as EstablishmentRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { EstablishmentRepositoryContract } from '../../domain/repositories/establishment.repository.contract';
import { Establishment } from '../../domain/entities/establishment.entity';
import { EstablishmentUnitTypeType } from '../../domain/enums/establishment-unit-type.enum';

@Injectable()
export class PrismaEstablishmentRepository
  implements EstablishmentRepositoryContract
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Establishment> {
    const record = await this.prisma.establishment.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundError(`Establishment with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Establishment[]> {
    const records = await this.prisma.establishment.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByCompanyId(companyId: string): Promise<Establishment[]> {
    const records = await this.prisma.establishment.findMany({
      where: { companyId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Establishment): Promise<Establishment> {
    const record = await this.prisma.establishment.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Establishment): Promise<Establishment> {
    const record = await this.prisma.establishment.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.establishment.delete({ where: { id } });
  }

  private toDomain(record: EstablishmentRecord): Establishment {
    return Establishment.create({
      id: record.id,
      companyId: record.companyId,
      name: record.name,
      cnpj: record.cnpj ?? undefined,
      unitType: record.unitType as EstablishmentUnitTypeType,
      address: record.address,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(establishment: Establishment) {
    return {
      id: establishment.id,
      companyId: establishment.companyId,
      name: establishment.name,
      cnpj: establishment.cnpj ?? null,
      unitType: establishment.unitType,
      address: establishment.address,
    };
  }
}
