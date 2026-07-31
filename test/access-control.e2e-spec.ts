import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/config/prisma/prisma.service';
import { AccessControlService } from '@/core/access-control/infrastructure/access-control.service';
import { CompanyRoleType } from '@/core/access-control/domain/enums/company-role-type.enum';
import { CompanyRoleRequiredError } from '@/core/access-control/domain/errors/company-role-required.error';
import {
  COMPANY_REPOSITORY,
  CompanyRepositoryContract,
} from '@/core/companies/domain/repositories/company.repository.contract';
import { Company } from '@/core/companies/domain/entities/company.entity';
import {
  ESTABLISHMENT_REPOSITORY,
  EstablishmentRepositoryContract,
} from '@/core/establishments/domain/repositories/establishment.repository.contract';
import { Establishment } from '@/core/establishments/domain/entities/establishment.entity';
import { EstablishmentUnitType } from '@/core/establishments/domain/enums/establishment-unit-type.enum';
import { AppModule } from './../src/app.module';

describe('AccessControlService (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let accessControlService: AccessControlService;
  let companyRepository: CompanyRepositoryContract;
  let establishmentRepository: EstablishmentRepositoryContract;
  let companies: Company[];
  let establishments: Establishment[];
  let userIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    accessControlService = moduleFixture.get(AccessControlService);
    companyRepository = moduleFixture.get(COMPANY_REPOSITORY);
    establishmentRepository = moduleFixture.get(ESTABLISHMENT_REPOSITORY);
  });

  afterAll(async () => {
    await moduleFixture.close();
  });

  beforeEach(() => {
    companies = [];
    establishments = [];
    userIds = [];
  });

  afterEach(async () => {
    await prisma.companyRole.deleteMany({
      where: { companyId: { in: companies.map((company) => company.id) } },
    });
    await prisma.establishmentAccess.deleteMany({
      where: {
        establishmentId: {
          in: establishments.map((establishment) => establishment.id),
        },
      },
    });
    await prisma.establishment.deleteMany({
      where: { id: { in: establishments.map((e) => e.id) } },
    });
    await prisma.company.deleteMany({
      where: { id: { in: companies.map((c) => c.id) } },
    });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
  });

  async function createUser() {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    });
    userIds.push(user.id);
    return user;
  }

  async function createCompany() {
    const company = await companyRepository.create(
      Company.create({
        cnpj: faker.string.numeric(14),
        corporateName: faker.company.name(),
        tradeName: faker.company.name(),
        address: faker.location.streetAddress(),
      }),
    );
    companies.push(company);
    return company;
  }

  async function createEstablishment(companyId: string) {
    const establishment = await establishmentRepository.create(
      Establishment.create({
        companyId,
        name: faker.company.name(),
        unitType: EstablishmentUnitType.HEADQUARTERS,
        address: faker.location.streetAddress(),
      }),
    );
    establishments.push(establishment);
    return establishment;
  }

  it('grants EstablishmentAccess when the User already has a CompanyRole in the owning Company', async () => {
    const company = await createCompany();
    const establishment = await createEstablishment(company.id);
    const user = await createUser();
    await accessControlService.grantCompanyRole(
      user.id,
      company.id,
      CompanyRoleType.MEMBER,
    );

    const access = await accessControlService.grantEstablishmentAccess(
      user.id,
      establishment.id,
    );

    expect(access.userId).toEqual(user.id);
    expect(access.establishmentId).toEqual(establishment.id);
  });

  it('rejects granting EstablishmentAccess when the User has no CompanyRole at all', async () => {
    const company = await createCompany();
    const establishment = await createEstablishment(company.id);

    await expect(
      accessControlService.grantEstablishmentAccess(
        faker.string.uuid(),
        establishment.id,
      ),
    ).rejects.toThrow(CompanyRoleRequiredError);
  });

  it('rejects granting EstablishmentAccess when the CompanyRole belongs to a different Company', async () => {
    const ownerCompany = await createCompany();
    const otherCompany = await createCompany();
    const establishment = await createEstablishment(ownerCompany.id);
    const user = await createUser();
    await accessControlService.grantCompanyRole(
      user.id,
      otherCompany.id,
      CompanyRoleType.MEMBER,
    );

    await expect(
      accessControlService.grantEstablishmentAccess(user.id, establishment.id),
    ).rejects.toThrow(CompanyRoleRequiredError);
  });
});
