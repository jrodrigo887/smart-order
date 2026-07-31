import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { PrismaService } from '@/config/prisma/prisma.service';
import {
  COLLABORATOR_REPOSITORY,
  CollaboratorRepositoryContract,
} from '@/core/collaborators/domain/repositories/collaborator.repository.contract';
import { Collaborator } from '@/core/collaborators/domain/entities/collaborator.entity';
import { CollaboratorRole } from '@/core/collaborators/domain/enums/collaborator-role.enum';
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

describe('PrismaCollaboratorRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let repository: CollaboratorRepositoryContract;
  let company: Company;
  let establishment: Establishment;
  let createdIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    repository = moduleFixture.get(COLLABORATOR_REPOSITORY);

    const companyRepository =
      moduleFixture.get<CompanyRepositoryContract>(COMPANY_REPOSITORY);
    const establishmentRepository =
      moduleFixture.get<EstablishmentRepositoryContract>(
        ESTABLISHMENT_REPOSITORY,
      );

    company = await companyRepository.create(
      Company.create({
        cnpj: faker.string.numeric(14),
        corporateName: faker.company.name(),
        tradeName: faker.company.name(),
        address: faker.location.streetAddress(),
      }),
    );
    establishment = await establishmentRepository.create(
      Establishment.create({
        companyId: company.id,
        name: faker.company.name(),
        unitType: EstablishmentUnitType.HEADQUARTERS,
        address: faker.location.streetAddress(),
      }),
    );
  });

  afterAll(async () => {
    await prisma.establishment.deleteMany({ where: { id: establishment.id } });
    await prisma.company.deleteMany({ where: { id: company.id } });
    await moduleFixture.close();
  });

  beforeEach(() => {
    createdIds = [];
  });

  afterEach(async () => {
    await prisma.collaborator.deleteMany({
      where: { id: { in: createdIds } },
    });
  });

  async function createCollaborator(props: { name: string }) {
    const collaborator = await repository.create(
      Collaborator.create({
        ...props,
        establishmentId: establishment.id,
        role: CollaboratorRole.WAITER,
      }),
    );
    createdIds.push(collaborator.id);
    return collaborator;
  }

  it('creates a Collaborator and reads it back by findById', async () => {
    const name = faker.person.fullName();
    const created = await createCollaborator({ name });

    const found = await repository.findById(created.id);

    expect(found.id).toEqual(created.id);
    expect(found.name).toEqual(name);
    expect(found.establishmentId).toEqual(establishment.id);
    expect(found.role).toEqual(CollaboratorRole.WAITER);
    expect(found.userId).toBeUndefined();
  });

  it('persists linkUser through update', async () => {
    const created = await createCollaborator({
      name: faker.person.fullName(),
    });
    const userId = faker.string.uuid();

    created.linkUser(userId);
    await repository.update(created.id, created);

    const found = await repository.findById(created.id);
    expect(found.userId).toEqual(userId);
  });

  it('throws NotFoundError when findById does not match any record', async () => {
    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('findAll returns the persisted Collaborators', async () => {
    const first = await createCollaborator({ name: faker.person.fullName() });
    const second = await createCollaborator({
      name: faker.person.fullName(),
    });

    const all = await repository.findAll();

    expect(all.map((collaborator) => collaborator.id)).toEqual(
      expect.arrayContaining([first.id, second.id]),
    );
  });
});
