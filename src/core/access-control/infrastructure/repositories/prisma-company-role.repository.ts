import { Injectable } from '@nestjs/common';
import { CompanyRole as CompanyRoleRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { CompanyRoleRepositoryContract } from '../../domain/repositories/company-role.repository.contract';
import { CompanyRole } from '../../domain/entities/company-role.entity';
import { CompanyRoleTypeType } from '../../domain/enums/company-role-type.enum';

@Injectable()
export class PrismaCompanyRoleRepository
  implements CompanyRoleRepositoryContract
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CompanyRole> {
    const record = await this.prisma.companyRole.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundError(`CompanyRole with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<CompanyRole[]> {
    const records = await this.prisma.companyRole.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByUserAndCompany(
    userId: string,
    companyId: string,
  ): Promise<CompanyRole | null> {
    const record = await this.prisma.companyRole.findUnique({
      where: { userId_companyId: { userId, companyId } },
    });
    return record ? this.toDomain(record) : null;
  }

  async create(data: CompanyRole): Promise<CompanyRole> {
    const record = await this.prisma.companyRole.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: CompanyRole): Promise<CompanyRole> {
    const record = await this.prisma.companyRole.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.companyRole.delete({ where: { id } });
  }

  private toDomain(record: CompanyRoleRecord): CompanyRole {
    return CompanyRole.create({
      id: record.id,
      userId: record.userId,
      companyId: record.companyId,
      role: record.role as CompanyRoleTypeType,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(companyRole: CompanyRole) {
    return {
      id: companyRole.id,
      userId: companyRole.userId,
      companyId: companyRole.companyId,
      role: companyRole.role,
    };
  }
}
