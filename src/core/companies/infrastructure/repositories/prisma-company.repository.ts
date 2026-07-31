import { Injectable } from '@nestjs/common';
import { Company as CompanyRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { CompanyRepositoryContract } from '../../domain/repositories/company.repository.contract';
import { Company } from '../../domain/entities/company.entity';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Company> {
    const record = await this.prisma.company.findUnique({ where: { id } });
    if (!record) {
      throw new NotFoundError(`Company with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Company[]> {
    const records = await this.prisma.company.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Company): Promise<Company> {
    const record = await this.prisma.company.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Company): Promise<Company> {
    const record = await this.prisma.company.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({ where: { id } });
  }

  private toDomain(record: CompanyRecord): Company {
    return Company.create({
      id: record.id,
      cnpj: record.cnpj,
      corporateName: record.corporateName,
      tradeName: record.tradeName,
      address: record.address,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(company: Company) {
    return {
      id: company.id,
      cnpj: company.cnpj,
      corporateName: company.corporateName,
      tradeName: company.tradeName,
      address: company.address,
    };
  }
}
