import { faker } from '@faker-js/faker';
import { User, UserProps } from '../entities/user.entity';
describe('UserEntity', () => {
  let sut: User;
  let userProps: UserProps;
  beforeEach(() => {
    userProps = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
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

  it('should be able to create a user with default createdAt date', () => {
    const prop = sut.getProp();
    expect(prop.createdAt).toBeInstanceOf(Date);
  });
});
