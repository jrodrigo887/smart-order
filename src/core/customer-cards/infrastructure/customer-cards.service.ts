import { Inject, Injectable } from '@nestjs/common';
import { CustomerCard } from '../domain/entities/customer-card.entity';
import { CustomerCardStatus } from '../domain/enums/customer-card-status.enum';
import {
  CUSTOMER_CARD_REPOSITORY,
  CustomerCardRepositoryContract,
} from '../domain/repositories/customer-card.repository.contract';

export type OpenCustomerCardInput = {
  cardNumber: number;
  collaboratorId: string;
  establishmentId: string;
};

@Injectable()
export class CustomerCardsService {
  constructor(
    @Inject(CUSTOMER_CARD_REPOSITORY)
    private readonly repository: CustomerCardRepositoryContract,
  ) {}

  async open(input: OpenCustomerCardInput): Promise<CustomerCard> {
    const customerCard = CustomerCard.create({
      cardNumber: input.cardNumber,
      collaboratorId: input.collaboratorId,
      establishmentId: input.establishmentId,
      openedAt: new Date(),
      closedAt: null,
      status: CustomerCardStatus.OPEN,
    });
    return this.repository.create(customerCard);
  }

  async findById(id: string): Promise<CustomerCard> {
    return this.repository.findById(id);
  }

  async markInUse(id: string, now?: Date): Promise<CustomerCard> {
    const customerCard = await this.repository.findById(id);
    customerCard.startUsing(now);
    return this.repository.update(id, customerCard);
  }

  async close(id: string): Promise<CustomerCard> {
    const customerCard = await this.repository.findById(id);
    customerCard.close();
    return this.repository.update(id, customerCard);
  }

  async cancel(id: string, now?: Date): Promise<CustomerCard> {
    const customerCard = await this.repository.findById(id);
    customerCard.cancel(now);
    return this.repository.update(id, customerCard);
  }

  async listByEstablishment(establishmentId: string): Promise<CustomerCard[]> {
    const all = await this.repository.findAll();
    return all.filter((card) => card.establishmentId === establishmentId);
  }
}
