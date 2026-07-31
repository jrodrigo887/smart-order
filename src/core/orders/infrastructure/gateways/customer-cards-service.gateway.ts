import { Injectable } from '@nestjs/common';
import { CustomerCardsService } from '@/core/customer-cards/infrastructure/customer-cards.service';
import { CustomerCard } from '@/core/customer-cards/domain/entities/customer-card.entity';
import { CustomerCardGateway } from '../../domain/ports/customer-card-gateway';

@Injectable()
export class CustomerCardsServiceGateway implements CustomerCardGateway {
  constructor(private readonly customerCardsService: CustomerCardsService) {}

  async findById(id: string): Promise<CustomerCard> {
    return this.customerCardsService.findById(id);
  }

  async markInUse(id: string): Promise<CustomerCard> {
    return this.customerCardsService.markInUse(id);
  }
}
