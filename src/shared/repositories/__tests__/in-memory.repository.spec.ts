import { EntityBase, EntityProps } from '@/shared/entities/entity-base';
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
    // const date1 = new Date();
    // entityProp = {
    //   ...entityProp,
    //   createdAt: date1,
    //   id: '1233-1234-1235',
    // };
    // const entity2 = new StubEntity<Props>(entityProp);
    // await sut.create(entity2);
    // const result = await sut.findById('1233-1234-1235');
    // expect(result).toStrictEqual(entityProp);
  });
});
