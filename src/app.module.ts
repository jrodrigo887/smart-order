import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/infrastructure/users.module';
import { CustomerCardsModule } from './core/customer-cards/infrastructure/customer-cards.module';
import { OrdersModule } from './core/orders/infrastructure/orders.module';
import { WaitersModule } from './core/waiters/infrastructure/waiters.module';

@Module({
  imports: [
    PrismaModule,
    EnvConfigModule,
    UsersModule,
    CustomerCardsModule,
    OrdersModule,
    WaitersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
