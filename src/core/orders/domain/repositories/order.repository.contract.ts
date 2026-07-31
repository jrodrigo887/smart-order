import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Order } from '../entities/order.entity';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepositoryContract extends RepositoryContract<Order> {
  findPendingByEstablishmentId(establishmentId: string): Promise<Order[]>;
}
