import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryWaiterRepository } from '../repositories/in-memory-waiter.repository';
import { WaitersService } from '../waiters.service';

describe('WaitersService', () => {
  let sut: WaitersService;
  let restaurantId: string;

  beforeEach(() => {
    sut = new WaitersService(new InMemoryWaiterRepository());
    restaurantId = faker.string.uuid();
  });

  it('should register a Waiter for a restaurant', async () => {
    const waiter = await sut.register({
      name: faker.person.fullName(),
      restaurantId,
    });

    expect(waiter.id).toBeDefined();
    expect(waiter.restaurantId).toEqual(restaurantId);
    expect(waiter.userId).toBeUndefined();
  });

  it('should find a Waiter by id', async () => {
    const waiter = await sut.register({
      name: faker.person.fullName(),
      restaurantId,
    });

    const found = await sut.findById(waiter.id);

    expect(found.id).toEqual(waiter.id);
  });

  it('should throw NotFoundError for an unknown Waiter', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should link a Waiter to a User account', async () => {
    const waiter = await sut.register({
      name: faker.person.fullName(),
      restaurantId,
    });
    const userId = faker.string.uuid();

    const linked = await sut.linkUser(waiter.id, userId);

    expect(linked.userId).toEqual(userId);
  });

  it('should list only Waiters from the given restaurant', async () => {
    const waiter = await sut.register({
      name: faker.person.fullName(),
      restaurantId,
    });
    await sut.register({
      name: faker.person.fullName(),
      restaurantId: faker.string.uuid(),
    });

    const result = await sut.listByRestaurant(restaurantId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(waiter.id);
  });
});
