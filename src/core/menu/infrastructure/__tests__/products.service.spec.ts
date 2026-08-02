import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryProductRepository } from '../repositories/in-memory-product.repository';
import { ProductsService } from '../products.service';
import { ProductStatus } from '../../domain/enums/product-status.enum';

describe('ProductsService', () => {
  let sut: ProductsService;
  let establishmentId: string;
  let categoryId: string;

  beforeEach(() => {
    sut = new ProductsService(new InMemoryProductRepository());
    establishmentId = faker.string.uuid();
    categoryId = faker.string.uuid();
  });

  it('should create a Product for an Establishment', async () => {
    const product = await sut.create({
      establishmentId,
      categoryId,
      name: faker.commerce.productName(),
      basePrice: 19.9,
    });

    expect(product.id).toBeDefined();
    expect(product.establishmentId).toEqual(establishmentId);
    expect(product.categoryId).toEqual(categoryId);
    expect(product.status).toEqual(ProductStatus.ACTIVE);
  });

  it('should find a Product by id', async () => {
    const product = await sut.create({
      establishmentId,
      categoryId,
      name: faker.commerce.productName(),
      basePrice: 19.9,
    });

    const found = await sut.findById(product.id);

    expect(found.id).toEqual(product.id);
  });

  it('should throw NotFoundError for an unknown Product', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should list only Products from the given Establishment', async () => {
    const product = await sut.create({
      establishmentId,
      categoryId,
      name: faker.commerce.productName(),
      basePrice: 19.9,
    });
    await sut.create({
      establishmentId: faker.string.uuid(),
      categoryId,
      name: faker.commerce.productName(),
      basePrice: 9.9,
    });

    const result = await sut.listByEstablishment(establishmentId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(product.id);
  });

  it('should discontinue and reactivate a Product', async () => {
    const product = await sut.create({
      establishmentId,
      categoryId,
      name: faker.commerce.productName(),
      basePrice: 19.9,
    });

    const discontinued = await sut.discontinue(product.id);
    expect(discontinued.status).toEqual(ProductStatus.DISCONTINUED);

    const reactivated = await sut.reactivate(product.id);
    expect(reactivated.status).toEqual(ProductStatus.ACTIVE);
  });
});
