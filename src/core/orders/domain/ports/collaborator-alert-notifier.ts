import { Order } from '../entities/order.entity';

export const COLLABORATOR_ALERT_NOTIFIER = Symbol(
  'COLLABORATOR_ALERT_NOTIFIER',
);

export interface CollaboratorAlertNotifier {
  notifyOrderReady(order: Order, collaboratorIds: string[]): Promise<void>;
}
