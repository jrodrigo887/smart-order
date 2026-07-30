import { Order } from '../entities/order.entity';

export class OrderReadyEvent {
  constructor(public readonly order: Order) {}
}
