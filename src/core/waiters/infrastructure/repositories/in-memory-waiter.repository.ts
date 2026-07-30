import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Waiter } from '../../domain/entities/waiter.entity';

export class InMemoryWaiterRepository extends InMemoryRepository<Waiter> {}
