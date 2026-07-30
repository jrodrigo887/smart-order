import { Module } from '@nestjs/common';
import { WAITER_REPOSITORY } from '../domain/repositories/waiter.repository.contract';
import { InMemoryWaiterRepository } from './repositories/in-memory-waiter.repository';
import { WaitersService } from './waiters.service';

@Module({
  providers: [
    WaitersService,
    { provide: WAITER_REPOSITORY, useClass: InMemoryWaiterRepository },
  ],
  exports: [WaitersService],
})
export class WaitersModule {}
