import { Module } from '@nestjs/common';
import { CUSTOMER_CARD_REPOSITORY } from '../domain/repositories/customer-card.repository.contract';
import { CustomerCardsService } from './customer-cards.service';
import { PrismaCustomerCardRepository } from './repositories/prisma-customer-card.repository';

@Module({
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
