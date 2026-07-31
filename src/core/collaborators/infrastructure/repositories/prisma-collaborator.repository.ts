import { Injectable } from '@nestjs/common';
import { Collaborator as CollaboratorRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { CollaboratorRepositoryContract } from '../../domain/repositories/collaborator.repository.contract';
import { Collaborator } from '../../domain/entities/collaborator.entity';
import { CollaboratorRoleType } from '../../domain/enums/collaborator-role.enum';

@Injectable()
export class PrismaCollaboratorRepository
  implements CollaboratorRepositoryContract
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Collaborator> {
    const record = await this.prisma.collaborator.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundError(`Collaborator with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<Collaborator[]> {
    const records = await this.prisma.collaborator.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async findByEstablishmentId(
    establishmentId: string,
  ): Promise<Collaborator[]> {
    const records = await this.prisma.collaborator.findMany({
      where: { establishmentId },
    });
    return records.map((record) => this.toDomain(record));
  }

  async create(data: Collaborator): Promise<Collaborator> {
    const record = await this.prisma.collaborator.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Collaborator): Promise<Collaborator> {
    const record = await this.prisma.collaborator.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.collaborator.delete({ where: { id } });
  }

  private toDomain(record: CollaboratorRecord): Collaborator {
    return Collaborator.create({
      id: record.id,
      name: record.name,
      establishmentId: record.establishmentId,
      role: record.role as CollaboratorRoleType,
      userId: record.userId ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(collaborator: Collaborator) {
    return {
      id: collaborator.id,
      name: collaborator.name,
      establishmentId: collaborator.establishmentId,
      role: collaborator.role,
      userId: collaborator.userId ?? null,
    };
  }
}
