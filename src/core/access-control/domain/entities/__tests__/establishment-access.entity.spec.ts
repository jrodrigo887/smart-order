import { faker } from '@faker-js/faker';
import {
  EstablishmentAccess,
  EstablishmentAccessProps,
} from '../establishment-access.entity';

describe('EstablishmentAccessEntity', () => {
  let props: EstablishmentAccessProps;
  let establishmentAccess: EstablishmentAccess;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      establishmentId: faker.string.uuid(),
    };
    establishmentAccess = EstablishmentAccess.create(props);
  });

  it('should create a valid EstablishmentAccess instance', () => {
    expect(establishmentAccess).toBeInstanceOf(EstablishmentAccess);
    expect(establishmentAccess.userId).toEqual(props.userId);
    expect(establishmentAccess.establishmentId).toEqual(props.establishmentId);
  });
});
