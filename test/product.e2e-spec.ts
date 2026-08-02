import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { PrismaService } from '@/config/prisma/prisma.service';
import {
  PRODUCT_REPOSITORY,
  ProductRepositoryContract,
} from '@/core/menu/domain/repositories/product.repository.contract';
import { Product } from '@/core/menu/domain/entities/product.entity';
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

describe('PrismaProductRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let repository: ProductRepositoryContract;
  let company: Company;
  let establishment: Establishment;
  let category: Category;
  let createdIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    repository = moduleFixture.get(PRODUCT_REPOSITORY);

    const companyRepository =
      moduleFixture.get<CompanyRepositoryContract>(COMPANY_REPOSITORY);
    const establishmentRepository =
      moduleFixture.get<EstablishmentRepositoryContract>(
        ESTABLISHMENT_REPOSITORY,
      );
    const categoryRepository =
      moduleFixture.get<CategoryRepositoryContract>(CATEGORY_REPOSITORY);

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
    category = await categoryRepository.create(
      Category.create({
        establishmentId: establishment.id,
        name: faker.commerce.department(),
      }),
    );
  });

  afterAll(async () => {
    await prisma.category.deleteMany({ where: { id: category.id } });
    await prisma.establishment.deleteMany({ where: { id: establishment.id } });
    await prisma.company.deleteMany({ where: { id: company.id } });
    await moduleFixture.close();
  });

  beforeEach(() => {
    createdIds = [];
  });

  afterEach(async () => {
    await prisma.product.deleteMany({ where: { id: { in: createdIds } } });
  });

  async function createProduct(props: { name: string; basePrice: number }) {
    const product = await repository.create(
      Product.create({
        ...props,
        establishmentId: establishment.id,
        categoryId: category.id,
      }),
    );
    createdIds.push(product.id);
    return product;
  }

  it('creates a Product and reads it back by findById', async () => {
    const name = faker.commerce.productName();
    const created = await createProduct({ name, basePrice: 19.9 });

    const found = await repository.findById(created.id);

    expect(found.id).toEqual(created.id);
    expect(found.name).toEqual(name);
    expect(found.basePrice).toEqual(19.9);
    expect(found.establishmentId).toEqual(establishment.id);
    expect(found.categoryId).toEqual(category.id);
  });

  it('throws NotFoundError when findById does not match any record', async () => {
    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('findAll returns the persisted Products', async () => {
    const first = await createProduct({
      name: faker.commerce.productName(),
      basePrice: 9.9,
    });
    const second = await createProduct({
      name: faker.commerce.productName(),
      basePrice: 12.5,
    });

    const all = await repository.findAll();

    expect(all.map((product) => product.id)).toEqual(
      expect.arrayContaining([first.id, second.id]),
    );
  });

  it('findByEstablishmentId returns only Products from that Establishment', async () => {
    const product = await createProduct({
      name: faker.commerce.productName(),
      basePrice: 9.9,
    });

    const result = await repository.findByEstablishmentId(establishment.id);

    expect(result.map((p) => p.id)).toEqual(
      expect.arrayContaining([product.id]),
    );
  });
});
