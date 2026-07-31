import { Module } from '@nestjs/common';
import { EstablishmentsModule } from '@/core/establishments/infrastructure/establishments.module';
import { COMPANY_ROLE_REPOSITORY } from '../domain/repositories/company-role.repository.contract';
import { ESTABLISHMENT_ACCESS_REPOSITORY } from '../domain/repositories/establishment-access.repository.contract';
import { PrismaCompanyRoleRepository } from './repositories/prisma-company-role.repository';
import { PrismaEstablishmentAccessRepository } from './repositories/prisma-establishment-access.repository';
import { AccessControlService } from './access-control.service';

@Module({
  imports: [EstablishmentsModule],
  providers: [
    AccessControlService,
    { provide: COMPANY_ROLE_REPOSITORY, useClass: PrismaCompanyRoleRepository },
    {
      provide: ESTABLISHMENT_ACCESS_REPOSITORY,
      useClass: PrismaEstablishmentAccessRepository,
    },
  ],
  exports: [AccessControlService],
})
export class AccessControlModule {}
