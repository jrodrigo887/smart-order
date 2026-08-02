import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryCategoryRepository } from '../repositories/in-memory-category.repository';
import { CategoriesService } from '../categories.service';

describe('CategoriesService', () => {
  let sut: CategoriesService;
  let establishmentId: string;

  beforeEach(() => {
    sut = new CategoriesService(new InMemoryCategoryRepository());
    establishmentId = faker.string.uuid();
  });

  it('should create a Category for an Establishment', async () => {
    const category = await sut.create({
      establishmentId,
      name: faker.commerce.department(),
    });

    expect(category.id).toBeDefined();
    expect(category.establishmentId).toEqual(establishmentId);
  });

  it('should find a Category by id', async () => {
    const category = await sut.create({
      establishmentId,
      name: faker.commerce.department(),
    });

    const found = await sut.findById(category.id);

    expect(found.id).toEqual(category.id);
  });

  it('should throw NotFoundError for an unknown Category', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should list only Categories from the given Establishment', async () => {
    const category = await sut.create({
      establishmentId,
      name: faker.commerce.department(),
    });
    await sut.create({
      establishmentId: faker.string.uuid(),
      name: faker.commerce.department(),
    });

    const result = await sut.listByEstablishment(establishmentId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(category.id);
  });
});
