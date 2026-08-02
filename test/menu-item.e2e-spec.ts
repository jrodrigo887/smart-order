import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { PrismaService } from '@/config/prisma/prisma.service';
import {
  MENU_ITEM_REPOSITORY,
  MenuItemRepositoryContract,
} from '@/core/menu/domain/repositories/menu-item.repository.contract';
import { MenuItem } from '@/core/menu/domain/entities/menu-item.entity';
import {
  MENU_REPOSITORY,
  MenuRepositoryContract,
} from '@/core/menu/domain/repositories/menu.repository.contract';
import { Menu } from '@/core/menu/domain/entities/menu.entity';
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

describe('PrismaMenuItemRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let repository: MenuItemRepositoryContract;
  let company: Company;
  let establishment: Establishment;
  let category: Category;
  let product: Product;
  let menu: Menu;
  let createdIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    repository = moduleFixture.get(MENU_ITEM_REPOSITORY);

    const companyRepository =
      moduleFixture.get<CompanyRepositoryContract>(COMPANY_REPOSITORY);
    const establishmentRepository =
      moduleFixture.get<EstablishmentRepositoryContract>(
        ESTABLISHMENT_REPOSITORY,
      );
    const categoryRepository =
      moduleFixture.get<CategoryRepositoryContract>(CATEGORY_REPOSITORY);
    const productRepository =
      moduleFixture.get<ProductRepositoryContract>(PRODUCT_REPOSITORY);
    const menuRepository =
      moduleFixture.get<MenuRepositoryContract>(MENU_REPOSITORY);

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
    product = await productRepository.create(
      Product.create({
        establishmentId: establishment.id,
        categoryId: category.id,
        name: faker.commerce.productName(),
        basePrice: 19.9,
      }),
    );
    menu = await menuRepository.create(
      Menu.create({
        establishmentId: establishment.id,
        name: 'Cardápio de Almoço',
      }),
    );
  });

  afterAll(async () => {
    await prisma.menu.deleteMany({ where: { id: menu.id } });
    await prisma.product.deleteMany({ where: { id: product.id } });
    await prisma.category.deleteMany({ where: { id: category.id } });
    await prisma.establishment.deleteMany({ where: { id: establishment.id } });
    await prisma.company.deleteMany({ where: { id: company.id } });
    await moduleFixture.close();
  });

  beforeEach(() => {
    createdIds = [];
  });

  afterEach(async () => {
    await prisma.menuItem.deleteMany({ where: { id: { in: createdIds } } });
  });

  async function createMenuItem(props: { price: number }) {
    const menuItem = await repository.create(
      MenuItem.create({ ...props, menuId: menu.id, productId: product.id }),
    );
    createdIds.push(menuItem.id);
    return menuItem;
  }

  it('creates a MenuItem and reads it back by findById', async () => {
    const created = await createMenuItem({ price: 24.5 });

    const found = await repository.findById(created.id);

    expect(found.id).toEqual(created.id);
    expect(found.menuId).toEqual(menu.id);
    expect(found.productId).toEqual(product.id);
    expect(found.price).toEqual(24.5);
    expect(found.status).toEqual('AVAILABLE');
  });

  it('throws NotFoundError when findById does not match any record', async () => {
    await expect(repository.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('findByMenuId returns only MenuItems from that Menu', async () => {
    const menuItem = await createMenuItem({ price: 24.5 });

    const result = await repository.findByMenuId(menu.id);

    expect(result.map((mi) => mi.id)).toEqual(
      expect.arrayContaining([menuItem.id]),
    );
  });

  it('persists price and status updates through update', async () => {
    const menuItem = await createMenuItem({ price: 24.5 });

    menuItem.updatePrice(30);
    menuItem.markUnavailable();
    await repository.update(menuItem.id, menuItem);

    const found = await repository.findById(menuItem.id);
    expect(found.price).toEqual(30);
    expect(found.status).toEqual('UNAVAILABLE');
  });
});
