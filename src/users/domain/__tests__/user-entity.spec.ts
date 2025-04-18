import { faker } from '@faker-js/faker';
import { UuidUnique } from '../../../shared/vo/uuid-unique.vo';
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

  it('should be verify undefined id with validator Value Object', () => {
    const prop = { ...userProps, id: undefined };
    sut = new User(prop);

    expect(UuidUnique.validate(sut.id)).toBe(true);
  });

  it('should be verify nullabe updatedAt', () => {
    const prop = { ...userProps, updatedAt: undefined };
    sut = new User(prop);
    expect(sut.updatedAt).toBeNull();
  });

  it('should be able to create a user with default createdAt date', () => {
    const prop = { ...userProps, createdAt: undefined };
    sut = new User(prop);

    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('should update name user', () => {
    expect(sut.name).toEqual(userProps.name);

    sut.updateName('new name');
    expect(sut.name).toEqual('new name');
  });

  it('should update password user', () => {
    expect(sut.password).toEqual(userProps.password);
    const pass = faker.internet.password();
    sut.updatePassword(pass);
    expect(sut.password).toEqual(pass);
  });
  it.each([{ name: '' }, { password: '' }, { email: '' }])(
    'Should call isNoEmpty error to name, email and password',
    (value) => {
      const prop = { ...userProps, ...value };
      expect(() => User.validator(prop)).toThrow();
    },
  );
  it('Should call isMaxLength error to name', () => {
    const name = 'a'.repeat(256);
    const prop = { ...userProps, name };
    expect(() => User.validator(prop)).toThrow();
  });
  it('Should call isMaxLength error to email', () => {
    const email = 'a'.repeat(256);
    const prop = { ...userProps, email };
    expect(() => User.validator(prop)).toThrow();
  });
  it('Should call isMaxLength error to password', () => {
    const password = 'a'.repeat(256);
    const prop = { ...userProps, password };
    expect(() => User.validator(prop)).toThrow();
  });
});
