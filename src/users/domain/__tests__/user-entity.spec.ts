import { faker } from '@faker-js/faker';
import { User, UserProps } from '../entities/user.entity';
describe('UserEntity', () => {
  let sut: User;
  let userProps: UserProps;
  // let values: (string | Date)[] = [];
  beforeEach(() => {
    userProps = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    sut = new User(userProps);
    // values = Object.values(userProps);
  });

  it('should be able to create a user', () => {
    expect(sut).toBeTruthy();
  });

  it('should be able to create a user with props', () => {
    const prop = sut.getProp();
    expect(prop.name).toBe(userProps.name);
    expect(prop.email).toBe(userProps.email);
    expect(prop.password).toBe(userProps.password);
  });

  it('should be able to create a user with name propertie', () => {
    expect(sut).toBeTruthy();
    expect(typeof sut.name).toBe('string');
    expect(sut.name).toBe(userProps.name);
  });

  it('should be able to create a user with email propertie', () => {
    expect(sut).toBeTruthy();
    expect(typeof sut.email).toBe('string');
    expect(sut.email).toBe(userProps.email);
  });

  it('should be able to create a user with password propertie', () => {
    expect(sut).toBeTruthy();
    expect(typeof sut.password).toBe('string');
    expect(sut.password).toBe(userProps.password);
  });

  it('should be able to create a user with createdAt propertie', () => {
    expect(sut).toBeTruthy();
    expect(sut.createdAt).toBeInstanceOf(Date);
    expect(sut.createdAt).toBe(userProps.createdAt);
  });

  it('should be able to create a user with updatedAt propertie', () => {
    expect(sut).toBeTruthy();
    expect(sut.updatedAt).toBeInstanceOf(Date);
    expect(sut.updatedAt).toBe(userProps.updatedAt);
  });

  it('should be verify nullabe id', () => {
    const prop = { ...userProps, id: undefined };
    sut = new User(prop);
    expect(sut.id).toBeUndefined();
  });

  it('should be verify nullabe updatedAt', () => {
    const prop = { ...userProps, updatedAt: undefined };
    sut = new User(prop);
    expect(sut.updatedAt).toBeUndefined();
  });

  it('should be able to create a user with default createdAt date', () => {
    const prop = { ...userProps, createdAt: undefined };
    sut = new User(prop);

    expect(sut.createdAt).toBeInstanceOf(Date);
  });
});
