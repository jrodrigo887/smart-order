import { faker } from '@faker-js/faker';
import { Establishment, EstablishmentProps } from '../establishment.entity';
import { EstablishmentUnitType } from '../../enums/establishment-unit-type.enum';

describe('EstablishmentEntity', () => {
  let props: EstablishmentProps;
  let establishment: Establishment;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      companyId: faker.string.uuid(),
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    };
    establishment = Establishment.create(props);
  });

  it('should create a valid Establishment instance', () => {
    expect(establishment).toBeInstanceOf(Establishment);
    expect(establishment.companyId).toEqual(props.companyId);
    expect(establishment.name).toEqual(props.name);
    expect(establishment.unitType).toEqual(props.unitType);
    expect(establishment.address).toEqual(props.address);
  });

  it('should have no cnpj by default', () => {
    expect(establishment.cnpj).toBeUndefined();
  });

  it('should allow creating an Establishment with its own cnpj', () => {
    const cnpj = faker.string.numeric(14);
    establishment = Establishment.create({ ...props, cnpj });
    expect(establishment.cnpj).toEqual(cnpj);
  });
});
