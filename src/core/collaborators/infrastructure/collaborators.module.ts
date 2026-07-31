import { Module } from '@nestjs/common';
import { COLLABORATOR_REPOSITORY } from '../domain/repositories/collaborator.repository.contract';
import { PrismaCollaboratorRepository } from './repositories/prisma-collaborator.repository';
import { CollaboratorsController } from './collaborators.controller';
import { CollaboratorsService } from './collaborators.service';

@Module({
  controllers: [CollaboratorsController],
  providers: [
    CollaboratorsService,
    {
      provide: COLLABORATOR_REPOSITORY,
      useClass: PrismaCollaboratorRepository,
    },
  ],
  exports: [CollaboratorsService],
})
export class CollaboratorsModule {}
