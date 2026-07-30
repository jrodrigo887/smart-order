import { Module } from '@nestjs/common';
import { CUSTOMER_CARD_REPOSITORY } from '../domain/repositories/customer-card.repository.contract';
import { CustomerCardsController } from './customer-cards.controller';
import { CustomerCardsService } from './customer-cards.service';
import { PrismaCustomerCardRepository } from './repositories/prisma-customer-card.repository';

@Module({
  controllers: [CustomerCardsController],
  providers: [
    CustomerCardsService,
    {
      provide: CUSTOMER_CARD_REPOSITORY,
      useClass: PrismaCustomerCardRepository,
    },
  ],
  exports: [CustomerCardsService],
})
export class CustomerCardsModule {}
