import { Inject, Injectable } from '@nestjs/common';
import { Establishment } from '../domain/entities/establishment.entity';
import {
  ESTABLISHMENT_REPOSITORY,
  EstablishmentRepositoryContract,
} from '../domain/repositories/establishment.repository.contract';
import { EstablishmentUnitTypeType } from '../domain/enums/establishment-unit-type.enum';

export type RegisterEstablishmentInput = {
  companyId: string;
  name: string;
  unitType: EstablishmentUnitTypeType;
  address: string;
  cnpj?: string;
};

@Injectable()
export class EstablishmentsService {
  constructor(
    @Inject(ESTABLISHMENT_REPOSITORY)
    private readonly repository: EstablishmentRepositoryContract,
  ) {}

  async register(input: RegisterEstablishmentInput): Promise<Establishment> {
    const establishment = Establishment.create(input);
    return this.repository.create(establishment);
  }

  async findById(id: string): Promise<Establishment> {
    return this.repository.findById(id);
  }

  async listByCompany(companyId: string): Promise<Establishment[]> {
    return this.repository.findByCompanyId(companyId);
  }
}
