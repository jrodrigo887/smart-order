import { faker } from '@faker-js/faker';
import { Company, CompanyProps } from '../company.entity';

describe('CompanyEntity', () => {
  let props: CompanyProps;
  let company: Company;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      cnpj: faker.string.numeric(14),
      corporateName: faker.company.name(),
      tradeName: faker.company.name(),
      address: faker.location.streetAddress(),
    };
    company = Company.create(props);
  });

  it('should create a valid Company instance', () => {
    expect(company).toBeInstanceOf(Company);
    expect(company.cnpj).toEqual(props.cnpj);
    expect(company.corporateName).toEqual(props.corporateName);
    expect(company.tradeName).toEqual(props.tradeName);
    expect(company.address).toEqual(props.address);
  });
});
