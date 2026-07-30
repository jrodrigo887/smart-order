import { EntityBase, EntityProps } from '@/shared/entities/entity-base';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryRepository } from '../in-memory.repository';

type Props<E = EntityProps> = {
  [k in keyof E]?: E[k];
} & {
  name: string;
  age: number;
};

export class StubEntity<T> extends EntityBase {
  constructor(private readonly ps: T) {
    super({});
  }
}

class StubRepository extends InMemoryRepository<StubEntity<Props>> {}

describe('InMemoryRepository', () => {
  let entity: StubEntity<Props>;
  let sut: InMemoryRepository<StubEntity<Props>>;
  const entityProp = {
    updatedAt: new Date(),
    name: 'John Doe',
    createdAt: new Date(),
    age: 30,
    id: '1233-1234-1234',
  };
  beforeEach(() => {
    entity = new StubEntity<Props>(entityProp);
    sut = new StubRepository();
  });
  it('should create an instance of InMemoryRepository', () => {
    expect(sut).toBeInstanceOf(InMemoryRepository);
  });
  it('should create an entity in memory repository', async () => {
    await sut.create(entity);
    const allEntities = await sut.findAll();
    expect(allEntities).toHaveLength(1);
  });

  it('should find an entity by id preserving its prototype', async () => {
    await sut.create(entity);
    const found = await sut.findById(entity.id);
    expect(found).toBeInstanceOf(StubEntity);
  });

  it('should update an entity, preserving its prototype', async () => {
    await sut.create(entity);
    const updated = await sut.update(entity.id, entity);
    expect(updated).toBeInstanceOf(StubEntity);
    const found = await sut.findById(entity.id);
    expect(found).toBeInstanceOf(StubEntity);
  });

  it('should throw NotFoundError when updating an unknown id', async () => {
    await expect(sut.update('unknown-id', entity)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should delete an entity', async () => {
    await sut.create(entity);
    await sut.delete(entity.id);
    await expect(sut.findById(entity.id)).rejects.toThrow(NotFoundError);
  });
});
