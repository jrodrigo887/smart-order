import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerCardsModule } from '@/core/customer-cards/infrastructure/customer-cards.module';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository.contract';
import { WAITER_ALERT_NOTIFIER } from '../domain/ports/waiter-alert-notifier';
import { OrderReadyHandler } from './handlers/order-ready.handler';
import { NoopWaiterAlertNotifier } from './notifiers/noop-waiter-alert.notifier';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [CqrsModule, CustomerCardsModule],
  providers: [
    OrdersService,
    OrderReadyHandler,
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
    { provide: WAITER_ALERT_NOTIFIER, useClass: NoopWaiterAlertNotifier },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
