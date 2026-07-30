import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { PrismaService } from '@/config/prisma/prisma.service';
import {
  WAITER_REPOSITORY,
  WaiterRepositoryContract,
} from '@/core/waiters/domain/repositories/waiter.repository.contract';
import { Waiter } from '@/core/waiters/domain/entities/waiter.entity';
import { AppModule } from './../src/app.module';

describe('PrismaWaiterRepository (e2e)', () => {
  let moduleFixture: TestingModule;
  let prisma: PrismaService;
  let repository: WaiterRepositoryContract;
  let restaurantId: string;
  let createdIds: string[];

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get(PrismaService);
    repository = moduleFixture.get(WAITER_REPOSITORY);
  });

  afterAll(async () => {
    await moduleFixture.close();
  });

  beforeEach(() => {
    restaurantId = faker.string.uuid();
    createdIds = [];
  });

  afterEach(async () => {
    await prisma.waiter.deleteMany({ where: { id: { in: createdIds } } });
  });

  async function createWaiter(props: { name: string; restaurantId: string }) {
    const waiter = await repository.create(Waiter.create(props));
    createdIds.push(waiter.id);
    return waiter;
  }

  it('creates a Waiter and reads it back by findById', async () => {
    const name = faker.person.fullName();
    const created = await createWaiter({ name, restaurantId });

    const found = await repository.findById(created.id);

    expect(found.id).toEqual(created.id);
    expect(found.name).toEqual(name);
    expect(found.restaurantId).toEqual(restaurantId);
    expect(found.userId).toBeUndefined();
  });

  it('persists linkUser through update', async () => {
    const created = await createWaiter({
      name: faker.person.fullName(),
      restaurantId,
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

  it('findAll returns the persisted Waiters', async () => {
    const first = await createWaiter({
      name: faker.person.fullName(),
      restaurantId,
    });
    const second = await createWaiter({
      name: faker.person.fullName(),
      restaurantId,
    });

    const all = await repository.findAll();

    expect(all.map((waiter) => waiter.id)).toEqual(
      expect.arrayContaining([first.id, second.id]),
    );
  });
});
