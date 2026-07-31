import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryCollaboratorRepository } from '../repositories/in-memory-collaborator.repository';
import { CollaboratorsService } from '../collaborators.service';
import { CollaboratorRole } from '../../domain/enums/collaborator-role.enum';

describe('CollaboratorsService', () => {
  let sut: CollaboratorsService;
  let establishmentId: string;

  beforeEach(() => {
    sut = new CollaboratorsService(new InMemoryCollaboratorRepository());
    establishmentId = faker.string.uuid();
  });

  it('should register a Collaborator for an Establishment', async () => {
    const collaborator = await sut.register({
      name: faker.person.fullName(),
      establishmentId,
      role: CollaboratorRole.WAITER,
    });

    expect(collaborator.id).toBeDefined();
    expect(collaborator.establishmentId).toEqual(establishmentId);
    expect(collaborator.role).toEqual(CollaboratorRole.WAITER);
    expect(collaborator.userId).toBeUndefined();
  });

  it('should find a Collaborator by id', async () => {
    const collaborator = await sut.register({
      name: faker.person.fullName(),
      establishmentId,
      role: CollaboratorRole.WAITER,
    });

    const found = await sut.findById(collaborator.id);

    expect(found.id).toEqual(collaborator.id);
  });

  it('should throw NotFoundError for an unknown Collaborator', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should link a Collaborator to a User account', async () => {
    const collaborator = await sut.register({
      name: faker.person.fullName(),
      establishmentId,
      role: CollaboratorRole.WAITER,
    });
    const userId = faker.string.uuid();

    const linked = await sut.linkUser(collaborator.id, userId);

    expect(linked.userId).toEqual(userId);
  });

  it('should list only Collaborators from the given Establishment', async () => {
    const collaborator = await sut.register({
      name: faker.person.fullName(),
      establishmentId,
      role: CollaboratorRole.WAITER,
    });
    await sut.register({
      name: faker.person.fullName(),
      establishmentId: faker.string.uuid(),
      role: CollaboratorRole.WAITER,
    });

    const result = await sut.listByEstablishment(establishmentId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(collaborator.id);
  });
});
