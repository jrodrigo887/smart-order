import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderReadyEvent } from '../../domain/events/order-ready.event';
import {
  COLLABORATOR_ALERT_NOTIFIER,
  CollaboratorAlertNotifier,
} from '../../domain/ports/collaborator-alert-notifier';
import {
  CUSTOMER_CARD_GATEWAY,
  CustomerCardGateway,
} from '../../domain/ports/customer-card-gateway';

@EventsHandler(OrderReadyEvent)
export class OrderReadyHandler implements IEventHandler<OrderReadyEvent> {
  constructor(
    @Inject(CUSTOMER_CARD_GATEWAY)
    private readonly customerCardGateway: CustomerCardGateway,
    @Inject(COLLABORATOR_ALERT_NOTIFIER)
    private readonly notifier: CollaboratorAlertNotifier,
  ) {}

  async handle(event: OrderReadyEvent): Promise<void> {
    const customerCard = await this.customerCardGateway.findById(
      event.order.customerCardId,
    );
    await this.notifier.notifyOrderReady(event.order, [
      customerCard.collaboratorId,
    ]);
  }
}
