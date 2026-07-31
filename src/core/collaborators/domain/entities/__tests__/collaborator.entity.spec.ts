import { faker } from '@faker-js/faker';
import { Collaborator, CollaboratorProps } from '../collaborator.entity';
import { CollaboratorRole } from '../../enums/collaborator-role.enum';

describe('CollaboratorEntity', () => {
  let props: CollaboratorProps;
  let collaborator: Collaborator;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      establishmentId: faker.string.uuid(),
      role: CollaboratorRole.WAITER,
    };
    collaborator = Collaborator.create(props);
  });

  it('should create a valid Collaborator instance', () => {
    expect(collaborator).toBeInstanceOf(Collaborator);
    expect(collaborator.name).toEqual(props.name);
    expect(collaborator.establishmentId).toEqual(props.establishmentId);
    expect(collaborator.role).toEqual(props.role);
  });

  it('should have no linked User by default', () => {
    expect(collaborator.userId).toBeUndefined();
  });

  it('should allow creating a Collaborator already linked to a User', () => {
    const userId = faker.string.uuid();
    collaborator = Collaborator.create({ ...props, userId });
    expect(collaborator.userId).toEqual(userId);
  });

  it('should link a Collaborator to a User account', () => {
    const userId = faker.string.uuid();
    collaborator.linkUser(userId);
    expect(collaborator.userId).toEqual(userId);
  });

  it('should reject linking a malformed User id', () => {
    expect(() => collaborator.linkUser('not-a-uuid')).toThrow();
  });

  it.each(Object.values(CollaboratorRole))(
    'should allow creating a Collaborator with role %s',
    (role) => {
      collaborator = Collaborator.create({ ...props, role });
      expect(collaborator.role).toEqual(role);
    },
  );
});
