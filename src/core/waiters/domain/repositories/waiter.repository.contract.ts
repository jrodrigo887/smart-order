import { RepositoryContract } from '@/shared/repositories/contracts/repository.contract';
import { Waiter } from '../entities/waiter.entity';

export const WAITER_REPOSITORY = Symbol('WAITER_REPOSITORY');

export type WaiterRepositoryContract = RepositoryContract<Waiter>;
