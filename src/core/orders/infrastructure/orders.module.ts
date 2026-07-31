import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerCardsModule } from '@/core/customer-cards/infrastructure/customer-cards.module';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository.contract';
import { COLLABORATOR_ALERT_NOTIFIER } from '../domain/ports/collaborator-alert-notifier';
import { OrderReadyHandler } from './handlers/order-ready.handler';
import { NoopCollaboratorAlertNotifier } from './notifiers/noop-collaborator-alert.notifier';
import { OrdersController } from './orders.controller';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [CqrsModule, CustomerCardsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderReadyHandler,
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
    {
      provide: COLLABORATOR_ALERT_NOTIFIER,
      useClass: NoopCollaboratorAlertNotifier,
    },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
