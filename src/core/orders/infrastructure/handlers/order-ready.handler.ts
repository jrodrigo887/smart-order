import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerCardsService } from '@/core/customer-cards/infrastructure/customer-cards.service';
import { OrderReadyEvent } from '../../domain/events/order-ready.event';
import {
  COLLABORATOR_ALERT_NOTIFIER,
  CollaboratorAlertNotifier,
} from '../../domain/ports/collaborator-alert-notifier';

@EventsHandler(OrderReadyEvent)
export class OrderReadyHandler implements IEventHandler<OrderReadyEvent> {
  constructor(
    private readonly customerCardsService: CustomerCardsService,
    @Inject(COLLABORATOR_ALERT_NOTIFIER)
    private readonly notifier: CollaboratorAlertNotifier,
  ) {}

  async handle(event: OrderReadyEvent): Promise<void> {
    const customerCard = await this.customerCardsService.findById(
      event.order.customerCardId,
    );
    await this.notifier.notifyOrderReady(event.order, [
      customerCard.collaboratorId,
    ]);
  }
}
