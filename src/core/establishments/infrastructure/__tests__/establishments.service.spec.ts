import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryEstablishmentRepository } from '../repositories/in-memory-establishment.repository';
import { EstablishmentsService } from '../establishments.service';
import { EstablishmentUnitType } from '../../domain/enums/establishment-unit-type.enum';

describe('EstablishmentsService', () => {
  let sut: EstablishmentsService;
  let companyId: string;

  beforeEach(() => {
    sut = new EstablishmentsService(new InMemoryEstablishmentRepository());
    companyId = faker.string.uuid();
  });

  it('should register an Establishment for a Company', async () => {
    const establishment = await sut.register({
      companyId,
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    });

    expect(establishment.id).toBeDefined();
    expect(establishment.companyId).toEqual(companyId);
  });

  it('should find an Establishment by id', async () => {
    const establishment = await sut.register({
      companyId,
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    });

    const found = await sut.findById(establishment.id);

    expect(found.id).toEqual(establishment.id);
  });

  it('should throw NotFoundError for an unknown Establishment', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should list only Establishments from the given Company', async () => {
    const establishment = await sut.register({
      companyId,
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    });
    await sut.register({
      companyId: faker.string.uuid(),
      name: faker.company.name(),
      unitType: EstablishmentUnitType.BRANCH,
      address: faker.location.streetAddress(),
    });

    const result = await sut.listByCompany(companyId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(establishment.id);
  });
});
