import { Inject, Injectable } from '@nestjs/common';
import { Waiter } from '../domain/entities/waiter.entity';
import {
  WAITER_REPOSITORY,
  WaiterRepositoryContract,
} from '../domain/repositories/waiter.repository.contract';

export type RegisterWaiterInput = {
  name: string;
  restaurantId: string;
  userId?: string;
};

@Injectable()
export class WaitersService {
  constructor(
    @Inject(WAITER_REPOSITORY)
    private readonly repository: WaiterRepositoryContract,
  ) {}

  async register(input: RegisterWaiterInput): Promise<Waiter> {
    const waiter = Waiter.create(input);
    return this.repository.create(waiter);
  }

  async findById(id: string): Promise<Waiter> {
    return this.repository.findById(id);
  }

  async linkUser(waiterId: string, userId: string): Promise<Waiter> {
    const waiter = await this.repository.findById(waiterId);
    waiter.linkUser(userId);
    return this.repository.update(waiterId, waiter);
  }

  async listByRestaurant(restaurantId: string): Promise<Waiter[]> {
    const all = await this.repository.findAll();
    return all.filter((waiter) => waiter.restaurantId === restaurantId);
  }
}
