import { Inject, Injectable } from '@nestjs/common';
import { CompanyRole } from '../domain/entities/company-role.entity';
import { EstablishmentAccess } from '../domain/entities/establishment-access.entity';
import {
  COMPANY_ROLE_REPOSITORY,
  CompanyRoleRepositoryContract,
} from '../domain/repositories/company-role.repository.contract';
import {
  ESTABLISHMENT_ACCESS_REPOSITORY,
  EstablishmentAccessRepositoryContract,
} from '../domain/repositories/establishment-access.repository.contract';
import {
  CompanyRoleType,
  CompanyRoleTypeType,
} from '../domain/enums/company-role-type.enum';
import { CompanyRoleRequiredError } from '../domain/errors/company-role-required.error';
import {
  ESTABLISHMENT_LOOKUP,
  EstablishmentLookup,
} from '../domain/ports/establishment-lookup';

@Injectable()
export class AccessControlService {
  constructor(
    @Inject(COMPANY_ROLE_REPOSITORY)
    private readonly companyRoleRepository: CompanyRoleRepositoryContract,
    @Inject(ESTABLISHMENT_ACCESS_REPOSITORY)
    private readonly establishmentAccessRepository: EstablishmentAccessRepositoryContract,
    @Inject(ESTABLISHMENT_LOOKUP)
    private readonly establishmentLookup: EstablishmentLookup,
  ) {}

  async grantCompanyRole(
    userId: string,
    companyId: string,
    role: CompanyRoleTypeType,
  ): Promise<CompanyRole> {
    const companyRole = CompanyRole.create({ userId, companyId, role });
    return this.companyRoleRepository.create(companyRole);
  }

  async grantEstablishmentAccess(
    userId: string,
    establishmentId: string,
  ): Promise<EstablishmentAccess> {
    const establishment =
      await this.establishmentLookup.findById(establishmentId);
    const companyRole = await this.companyRoleRepository.findByUserAndCompany(
      userId,
      establishment.companyId,
    );
    if (!companyRole) {
      throw new CompanyRoleRequiredError(
        `User ${userId} has no CompanyRole in the Company that owns Establishment ${establishmentId}`,
      );
    }

    const establishmentAccess = EstablishmentAccess.create({
      userId,
      establishmentId,
    });
    return this.establishmentAccessRepository.create(establishmentAccess);
  }

  async resolveAccess(
    userId: string,
    establishmentId: string,
  ): Promise<boolean> {
    const establishment =
      await this.establishmentLookup.findById(establishmentId);
    const companyRole = await this.companyRoleRepository.findByUserAndCompany(
      userId,
      establishment.companyId,
    );
    if (!companyRole) {
      return false;
    }
    if (companyRole.role === CompanyRoleType.ADMINISTRATOR) {
      return true;
    }
    const establishmentAccess =
      await this.establishmentAccessRepository.findByUserAndEstablishment(
        userId,
        establishmentId,
      );
    return establishmentAccess !== null;
  }
}
