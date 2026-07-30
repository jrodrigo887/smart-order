import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { CustomerCard } from '../../domain/entities/customer-card.entity';

export class InMemoryCustomerCardRepository extends InMemoryRepository<CustomerCard> {}
