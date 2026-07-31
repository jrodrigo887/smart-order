import { faker } from '@faker-js/faker';
import { EstablishmentsService } from '@/core/establishments/infrastructure/establishments.service';
import { InMemoryEstablishmentRepository } from '@/core/establishments/infrastructure/repositories/in-memory-establishment.repository';
import { EstablishmentUnitType } from '@/core/establishments/domain/enums/establishment-unit-type.enum';
import { InMemoryCompanyRoleRepository } from '../repositories/in-memory-company-role.repository';
import { InMemoryEstablishmentAccessRepository } from '../repositories/in-memory-establishment-access.repository';
import { AccessControlService } from '../access-control.service';
import { CompanyRoleType } from '../../domain/enums/company-role-type.enum';
import { CompanyRoleRequiredError } from '../../domain/errors/company-role-required.error';

describe('AccessControlService', () => {
  let sut: AccessControlService;
  let establishmentsService: EstablishmentsService;

  beforeEach(() => {
    establishmentsService = new EstablishmentsService(
      new InMemoryEstablishmentRepository(),
    );
    sut = new AccessControlService(
      new InMemoryCompanyRoleRepository(),
      new InMemoryEstablishmentAccessRepository(),
      establishmentsService,
    );
  });

  it('should grant EstablishmentAccess when the User already has a CompanyRole in the owning Company', async () => {
    const userId = faker.string.uuid();
    const companyId = faker.string.uuid();
    const establishment = await establishmentsService.register({
      companyId,
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    });
    await sut.grantCompanyRole(userId, companyId, CompanyRoleType.MEMBER);

    const access = await sut.grantEstablishmentAccess(userId, establishment.id);

    expect(access.userId).toEqual(userId);
    expect(access.establishmentId).toEqual(establishment.id);
  });

  it('should not grant EstablishmentAccess when the User has no CompanyRole at all', async () => {
    const userId = faker.string.uuid();
    const establishment = await establishmentsService.register({
      companyId: faker.string.uuid(),
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    });

    await expect(
      sut.grantEstablishmentAccess(userId, establishment.id),
    ).rejects.toThrow(CompanyRoleRequiredError);
  });

  it('should not grant EstablishmentAccess when the CompanyRole belongs to a different Company', async () => {
    const userId = faker.string.uuid();
    const establishment = await establishmentsService.register({
      companyId: faker.string.uuid(),
      name: faker.company.name(),
      unitType: EstablishmentUnitType.HEADQUARTERS,
      address: faker.location.streetAddress(),
    });
    await sut.grantCompanyRole(
      userId,
      faker.string.uuid(),
      CompanyRoleType.MEMBER,
    );

    await expect(
      sut.grantEstablishmentAccess(userId, establishment.id),
    ).rejects.toThrow(CompanyRoleRequiredError);
  });

  describe('resolveAccess', () => {
    it('should grant access to an Administrator without an EstablishmentAccess record', async () => {
      const userId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const establishment = await establishmentsService.register({
        companyId,
        name: faker.company.name(),
        unitType: EstablishmentUnitType.HEADQUARTERS,
        address: faker.location.streetAddress(),
      });
      await sut.grantCompanyRole(
        userId,
        companyId,
        CompanyRoleType.ADMINISTRATOR,
      );

      const hasAccess = await sut.resolveAccess(userId, establishment.id);

      expect(hasAccess).toBe(true);
    });

    it('should deny access to a Member without an EstablishmentAccess record', async () => {
      const userId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const establishment = await establishmentsService.register({
        companyId,
        name: faker.company.name(),
        unitType: EstablishmentUnitType.HEADQUARTERS,
        address: faker.location.streetAddress(),
      });
      await sut.grantCompanyRole(userId, companyId, CompanyRoleType.MEMBER);

      const hasAccess = await sut.resolveAccess(userId, establishment.id);

      expect(hasAccess).toBe(false);
    });

    it('should grant access to a Member with an EstablishmentAccess record', async () => {
      const userId = faker.string.uuid();
      const companyId = faker.string.uuid();
      const establishment = await establishmentsService.register({
        companyId,
        name: faker.company.name(),
        unitType: EstablishmentUnitType.HEADQUARTERS,
        address: faker.location.streetAddress(),
      });
      await sut.grantCompanyRole(userId, companyId, CompanyRoleType.MEMBER);
      await sut.grantEstablishmentAccess(userId, establishment.id);

      const hasAccess = await sut.resolveAccess(userId, establishment.id);

      expect(hasAccess).toBe(true);
    });

    it('should deny access to a User with no CompanyRole in the owning Company', async () => {
      const userId = faker.string.uuid();
      const establishment = await establishmentsService.register({
        companyId: faker.string.uuid(),
        name: faker.company.name(),
        unitType: EstablishmentUnitType.HEADQUARTERS,
        address: faker.location.streetAddress(),
      });

      const hasAccess = await sut.resolveAccess(userId, establishment.id);

      expect(hasAccess).toBe(false);
    });
  });
});
