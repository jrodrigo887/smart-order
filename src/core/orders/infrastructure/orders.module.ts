import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CustomerCardsModule } from '@/core/customer-cards/infrastructure/customer-cards.module';
import { CollaboratorsModule } from '@/core/collaborators/infrastructure/collaborators.module';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository.contract';
import { COLLABORATOR_ALERT_NOTIFIER } from '../domain/ports/collaborator-alert-notifier';
import { CUSTOMER_CARD_GATEWAY } from '../domain/ports/customer-card-gateway';
import { OrderReadyHandler } from './handlers/order-ready.handler';
import { NoopCollaboratorAlertNotifier } from './notifiers/noop-collaborator-alert.notifier';
import { CustomerCardsServiceGateway } from './gateways/customer-cards-service.gateway';
import { OrdersController } from './orders.controller';
import { InMemoryOrderRepository } from './repositories/in-memory-order.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [CqrsModule, CustomerCardsModule, CollaboratorsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderReadyHandler,
    { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
    {
      provide: COLLABORATOR_ALERT_NOTIFIER,
      useClass: NoopCollaboratorAlertNotifier,
    },
    { provide: CUSTOMER_CARD_GATEWAY, useClass: CustomerCardsServiceGateway },
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
