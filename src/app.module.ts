import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/infrastructure/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      autoLoadEntities: true,
      // Use the path to your entities
      // This is a workaround for the issue with TypeORM and NestJS
      entities: [__dirname + 'src/**/*.entity{.ts,.js}'],
      migrations: ['src/migrations/*.ts'],
      synchronize: true,
      logging: true,
      // Use the path to your migrations
    }),
    EnvConfigModule,
    UsersModule,
  ],
})
@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
