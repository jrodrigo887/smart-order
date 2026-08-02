import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { PrismaService } from '@/config/prisma/prisma.service';
import {
  MENU_REPOSITORY,
  MenuRepositoryContract,
} from '@/core/menu/domain/repositories/menu.repository.contract';
import { Menu } from '@/core/menu/domain/entities/menu.entity';
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

describe('PrismaMenuRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let repository: MenuRepositoryContract;
  let company: Company;
  let establishment: Establishment;
  let createdIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    repository = moduleFixture.get(MENU_REPOSITORY);

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
    await prisma.menu.deleteMany({ where: { id: { in: createdIds } } });
  });

  async function createMenu(props: { name: string }) {
    const menu = await repository.create(
      Menu.create({ ...props, establishmentId: establishment.id }),
    );
    createdIds.push(menu.id);
    return menu;
  }

  it('creates a Menu and reads it back by findById', async () => {
    const name = 'Cardápio de Almoço';
    const created = await createMenu({ name });

    const found = await repository.findById(created.id);

    expect(found.id).toEqual(created.id);
    expect(found.name).toEqual(name);
    expect(found.establishmentId).toEqual(establishment.id);
    expect(found.status).toEqual('ACTIVE');
  });

  it('throws NotFoundError when findById does not match any record', async () => {
    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('findAll returns the persisted Menus', async () => {
    const first = await createMenu({ name: 'Cardápio de Almoço' });
    const second = await createMenu({ name: 'Cardápio de Bebidas' });

    const all = await repository.findAll();

    expect(all.map((menu) => menu.id)).toEqual(
      expect.arrayContaining([first.id, second.id]),
    );
  });

  it('findByEstablishmentId returns only Menus from that Establishment', async () => {
    const menu = await createMenu({ name: 'Cardápio de Almoço' });

    const result = await repository.findByEstablishmentId(establishment.id);

    expect(result.map((m) => m.id)).toEqual(
      expect.arrayContaining([menu.id]),
    );
  });

  it('persists deactivate/activate through update', async () => {
    const menu = await createMenu({ name: 'Cardápio de Almoço' });

    menu.deactivate();
    await repository.update(menu.id, menu);

    const found = await repository.findById(menu.id);
    expect(found.status).toEqual('INACTIVE');
  });
});
