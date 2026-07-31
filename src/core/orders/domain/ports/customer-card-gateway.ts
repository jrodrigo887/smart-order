import { CustomerCard } from '@/core/customer-cards/domain/entities/customer-card.entity';

export const CUSTOMER_CARD_GATEWAY = Symbol('CUSTOMER_CARD_GATEWAY');

export interface CustomerCardGateway {
  findById(id: string): Promise<CustomerCard>;
  markInUse(id: string): Promise<CustomerCard>;
}
