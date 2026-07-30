import { Injectable } from '@nestjs/common';
import { WaiterAlertNotifier } from '../../domain/ports/waiter-alert-notifier';

// Placeholder until a real delivery channel (push/socket/SMS) is wired up.
@Injectable()
export class NoopWaiterAlertNotifier implements WaiterAlertNotifier {
  async notifyOrderReady(): Promise<void> {}
}
