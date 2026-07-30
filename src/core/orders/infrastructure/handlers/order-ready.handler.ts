import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerCardsService } from '@/core/customer-cards/infrastructure/customer-cards.service';
import { OrderReadyEvent } from '../../domain/events/order-ready.event';
import {
  WAITER_ALERT_NOTIFIER,
  WaiterAlertNotifier,
} from '../../domain/ports/waiter-alert-notifier';

@EventsHandler(OrderReadyEvent)
export class OrderReadyHandler implements IEventHandler<OrderReadyEvent> {
  constructor(
    private readonly customerCardsService: CustomerCardsService,
    @Inject(WAITER_ALERT_NOTIFIER)
    private readonly notifier: WaiterAlertNotifier,
  ) {}

  async handle(event: OrderReadyEvent): Promise<void> {
    const customerCard = await this.customerCardsService.findById(
      event.order.customerCardId,
    );
    await this.notifier.notifyOrderReady(event.order, [customerCard.waiterId]);
  }
}
