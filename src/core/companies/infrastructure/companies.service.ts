import { Inject, Injectable } from '@nestjs/common';
import { Company } from '../domain/entities/company.entity';
import {
  COMPANY_REPOSITORY,
  CompanyRepositoryContract,
} from '../domain/repositories/company.repository.contract';

export type RegisterCompanyInput = {
  cnpj: string;
  corporateName: string;
  tradeName: string;
  address: string;
};

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly repository: CompanyRepositoryContract,
  ) {}

  async register(input: RegisterCompanyInput): Promise<Company> {
    const company = Company.create(input);
    return this.repository.create(company);
  }

  async findById(id: string): Promise<Company> {
    return this.repository.findById(id);
  }
}
