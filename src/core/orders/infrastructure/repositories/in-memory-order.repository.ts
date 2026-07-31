import { InMemoryRepository } from '@/shared/repositories/in-memory.repository';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryContract } from '../../domain/repositories/order.repository.contract';

export class InMemoryOrderRepository
  extends InMemoryRepository<Order>
  implements OrderRepositoryContract
{
  findPendingByEstablishmentId(establishmentId: string): Promise<Order[]> {
    return Promise.resolve(
      this.getAll().filter(
        (order) =>
          order.establishmentId === establishmentId && !order.isReady(),
      ),
    );
  }
}
