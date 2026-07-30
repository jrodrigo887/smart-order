import { faker } from '@faker-js/faker';
import { Waiter, WaiterProps } from '../waiter.entity';

describe('WaiterEntity', () => {
  let props: WaiterProps;
  let waiter: Waiter;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      restaurantId: faker.string.uuid(),
    };
    waiter = Waiter.create(props);
  });

  it('should create a valid Waiter instance', () => {
    expect(waiter).toBeInstanceOf(Waiter);
    expect(waiter.name).toEqual(props.name);
    expect(waiter.restaurantId).toEqual(props.restaurantId);
  });

  it('should have no linked User by default', () => {
    expect(waiter.userId).toBeUndefined();
  });

  it('should allow creating a Waiter already linked to a User', () => {
    const userId = faker.string.uuid();
    waiter = Waiter.create({ ...props, userId });
    expect(waiter.userId).toEqual(userId);
  });

  it('should link a Waiter to a User account', () => {
    const userId = faker.string.uuid();
    waiter.linkUser(userId);
    expect(waiter.userId).toEqual(userId);
  });

  it('should reject linking a malformed User id', () => {
    expect(() => waiter.linkUser('not-a-uuid')).toThrow();
  });
});
