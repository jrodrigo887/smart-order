import { Injectable } from '@nestjs/common';
import { CollaboratorAlertNotifier } from '../../domain/ports/collaborator-alert-notifier';

// Placeholder until a real delivery channel (push/socket/SMS) is wired up.
@Injectable()
export class NoopCollaboratorAlertNotifier
  implements CollaboratorAlertNotifier
{
  async notifyOrderReady(): Promise<void> {}
}
