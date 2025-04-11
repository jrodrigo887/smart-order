import { EntityBase } from '../entity-base';

type Props = {
  prop1: string;
  prop2: number;
  updatedAt?: Date;
  createdAt?: Date;
  id?: string;
};

class StubEntity extends EntityBase {
  constructor(vl: Partial<Props>) {
    super(vl);
  }
}

let props: Props;
let entity: StubEntity;

beforeEach(() => {
  props = {
    prop1: 'test',
    prop2: 123,
    updatedAt: new Date(),
    createdAt: new Date(),
    id: 'test-id',
  };
  entity = new StubEntity(props);
});

describe('EntityBase', () => {
  it('should create an instance of EntityBase', () => {
    expect(entity).toBeInstanceOf(EntityBase);
  });

  it('should assign id and createdAt properties', () => {
    expect(entity.id).toBeDefined();
    expect(entity.createdAt).toBeInstanceOf(Date);
  });

  it('should assign updatedAt property if provided', () => {
    const date = new Date();
    const entity = new StubEntity({ updatedAt: date });
    expect(entity.updatedAt).toEqual(date);
  });

  it('should assign updatedAt property if provided', () => {
    const entity = new StubEntity({ ...props, updatedAt: undefined });
    expect(entity.updatedAt).toEqual(null);
  });

  it('should assign createdAt property if provided', () => {
    const date = new Date();
    const pr = { ...props, createdAt: date };
    const entity = new StubEntity(pr);
    expect(entity.createdAt).toEqual(date);
  });
});
