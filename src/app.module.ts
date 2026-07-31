import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './config/prisma/prisma.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/infrastructure/users.module';
import { CustomerCardsModule } from './core/customer-cards/infrastructure/customer-cards.module';
import { OrdersModule } from './core/orders/infrastructure/orders.module';
import { CollaboratorsModule } from './core/collaborators/infrastructure/collaborators.module';
import { CompaniesModule } from './core/companies/infrastructure/companies.module';
import { EstablishmentsModule } from './core/establishments/infrastructure/establishments.module';

@Module({
  imports: [
    PrismaModule,
    EnvConfigModule,
    UsersModule,
    CustomerCardsModule,
    OrdersModule,
    CollaboratorsModule,
    CompaniesModule,
    EstablishmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
