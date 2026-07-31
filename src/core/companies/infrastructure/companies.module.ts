import { Module } from '@nestjs/common';
import { COMPANY_REPOSITORY } from '../domain/repositories/company.repository.contract';
import { PrismaCompanyRepository } from './repositories/prisma-company.repository';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    { provide: COMPANY_REPOSITORY, useClass: PrismaCompanyRepository },
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
