import { Order } from '../entities/order.entity';

export const WAITER_ALERT_NOTIFIER = Symbol('WAITER_ALERT_NOTIFIER');

export interface WaiterAlertNotifier {
  notifyOrderReady(order: Order, waiterIds: string[]): Promise<void>;
}
