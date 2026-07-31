import { Injectable } from '@nestjs/common';
import { CustomerCard as CustomerCardRecord } from '@prisma/client';
import { PrismaService } from '@/config/prisma/prisma.service';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { CustomerCard } from '../../domain/entities/customer-card.entity';
import { CustomerCardStatusType } from '../../domain/enums/customer-card-status.enum';

@Injectable()
export class PrismaCustomerCardRepository
  implements RepositoryContract<CustomerCard>
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CustomerCard> {
    const record = await this.prisma.customerCard.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundError(`CustomerCard with id ${id} not found`);
    }
    return this.toDomain(record);
  }

  async findAll(): Promise<CustomerCard[]> {
    const records = await this.prisma.customerCard.findMany();
    return records.map((record) => this.toDomain(record));
  }

  async create(data: CustomerCard): Promise<CustomerCard> {
    const record = await this.prisma.customerCard.create({
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async update(id: string, data: CustomerCard): Promise<CustomerCard> {
    const record = await this.prisma.customerCard.update({
      where: { id },
      data: this.toPersistence(data),
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customerCard.delete({ where: { id } });
  }

  private toDomain(record: CustomerCardRecord): CustomerCard {
    return CustomerCard.create({
      id: record.id,
      cardNumber: record.cardNumber,
      collaboratorId: record.collaboratorId,
      establishmentId: record.establishmentId,
      openedAt: record.openedAt,
      firstOrderAt: record.firstOrderAt,
      closedAt: record.closedAt,
      status: record.status as CustomerCardStatusType,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  private toPersistence(card: CustomerCard) {
    return {
      id: card.id,
      cardNumber: card.cardNumber,
      collaboratorId: card.collaboratorId,
      establishmentId: card.establishmentId,
      openedAt: card.openedAt,
      firstOrderAt: card.firstOrderAt,
      closedAt: card.closedAt,
      status: card.status,
    };
  }
}
