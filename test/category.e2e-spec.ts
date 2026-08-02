import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { PrismaService } from '@/config/prisma/prisma.service';
import {
  CATEGORY_REPOSITORY,
  CategoryRepositoryContract,
} from '@/core/menu/domain/repositories/category.repository.contract';
import { Category } from '@/core/menu/domain/entities/category.entity';
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

describe('PrismaCategoryRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let repository: CategoryRepositoryContract;
  let company: Company;
  let establishment: Establishment;
  let createdIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    repository = moduleFixture.get(CATEGORY_REPOSITORY);

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
    await prisma.category.deleteMany({ where: { id: { in: createdIds } } });
  });

  async function createCategory(props: { name: string }) {
    const category = await repository.create(
      Category.create({ ...props, establishmentId: establishment.id }),
    );
    createdIds.push(category.id);
    return category;
  }

  it('creates a Category and reads it back by findById', async () => {
    const name = faker.commerce.department();
    const created = await createCategory({ name });

    const found = await repository.findById(created.id);

    expect(found.id).toEqual(created.id);
    expect(found.name).toEqual(name);
    expect(found.establishmentId).toEqual(establishment.id);
  });

  it('throws NotFoundError when findById does not match any record', async () => {
    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('findAll returns the persisted Categories', async () => {
    const first = await createCategory({ name: faker.commerce.department() });
    const second = await createCategory({
      name: faker.commerce.department(),
    });

    const all = await repository.findAll();

    expect(all.map((category) => category.id)).toEqual(
      expect.arrayContaining([first.id, second.id]),
    );
  });

  it('findByEstablishmentId returns only Categories from that Establishment', async () => {
    const category = await createCategory({
      name: faker.commerce.department(),
    });

    const result = await repository.findByEstablishmentId(establishment.id);

    expect(result.map((c) => c.id)).toEqual(
      expect.arrayContaining([category.id]),
    );
  });
});
