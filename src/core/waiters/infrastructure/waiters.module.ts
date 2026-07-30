import { Module } from '@nestjs/common';
import { WAITER_REPOSITORY } from '../domain/repositories/waiter.repository.contract';
import { PrismaWaiterRepository } from './repositories/prisma-waiter.repository';
import { WaitersController } from './waiters.controller';
import { WaitersService } from './waiters.service';

@Module({
  controllers: [WaitersController],
  providers: [
    WaitersService,
    { provide: WAITER_REPOSITORY, useClass: PrismaWaiterRepository },
  ],
  exports: [WaitersService],
})
export class WaitersModule {}
