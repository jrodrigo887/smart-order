import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { CustomerCard } from '../entities/customer-card.entity';

export const CUSTOMER_CARD_REPOSITORY = Symbol('CUSTOMER_CARD_REPOSITORY');

export interface CustomerCardRepositoryContract
  extends RepositoryContract<CustomerCard> {
  findByEstablishmentId(establishmentId: string): Promise<CustomerCard[]>;
}
