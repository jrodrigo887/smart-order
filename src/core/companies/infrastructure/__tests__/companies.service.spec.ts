import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryCompanyRepository } from '../repositories/in-memory-company.repository';
import { CompaniesService } from '../companies.service';

describe('CompaniesService', () => {
  let sut: CompaniesService;

  beforeEach(() => {
    sut = new CompaniesService(new InMemoryCompanyRepository());
  });

  it('should register a Company', async () => {
    const input = {
      cnpj: faker.string.numeric(14),
      corporateName: faker.company.name(),
      tradeName: faker.company.name(),
      address: faker.location.streetAddress(),
    };

    const company = await sut.register(input);

    expect(company.id).toBeDefined();
    expect(company.cnpj).toEqual(input.cnpj);
    expect(company.corporateName).toEqual(input.corporateName);
  });

  it('should find a Company by id', async () => {
    const company = await sut.register({
      cnpj: faker.string.numeric(14),
      corporateName: faker.company.name(),
      tradeName: faker.company.name(),
      address: faker.location.streetAddress(),
    });

    const found = await sut.findById(company.id);

    expect(found.id).toEqual(company.id);
  });

  it('should throw NotFoundError for an unknown Company', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });
});
