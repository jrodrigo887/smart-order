import { faker } from '@faker-js/faker';
import { CompanyRole, CompanyRoleProps } from '../company-role.entity';
import { CompanyRoleType } from '../../enums/company-role-type.enum';

describe('CompanyRoleEntity', () => {
  let props: CompanyRoleProps;
  let companyRole: CompanyRole;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      companyId: faker.string.uuid(),
      role: CompanyRoleType.MEMBER,
    };
    companyRole = CompanyRole.create(props);
  });

  it('should create a valid CompanyRole instance', () => {
    expect(companyRole).toBeInstanceOf(CompanyRole);
    expect(companyRole.userId).toEqual(props.userId);
    expect(companyRole.companyId).toEqual(props.companyId);
    expect(companyRole.role).toEqual(props.role);
  });

  it.each(Object.values(CompanyRoleType))(
    'should allow creating a CompanyRole with role %s',
    (role) => {
      companyRole = CompanyRole.create({ ...props, role });
      expect(companyRole.role).toEqual(role);
    },
  );
});
