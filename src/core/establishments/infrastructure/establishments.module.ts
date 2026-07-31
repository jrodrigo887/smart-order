import { Module } from '@nestjs/common';
import { ESTABLISHMENT_REPOSITORY } from '../domain/repositories/establishment.repository.contract';
import { PrismaEstablishmentRepository } from './repositories/prisma-establishment.repository';
import { EstablishmentsController } from './establishments.controller';
import { EstablishmentsService } from './establishments.service';

@Module({
  controllers: [EstablishmentsController],
  providers: [
    EstablishmentsService,
    {
      provide: ESTABLISHMENT_REPOSITORY,
      useClass: PrismaEstablishmentRepository,
    },
  ],
  exports: [EstablishmentsService],
})
export class EstablishmentsModule {}
