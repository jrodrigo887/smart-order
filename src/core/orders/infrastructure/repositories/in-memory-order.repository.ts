import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Order } from '../../domain/entities/order.entity';

export class InMemoryOrderRepository extends InMemoryRepository<Order> {}
