import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryMenuRepository } from '../repositories/in-memory-menu.repository';
import { MenusService } from '../menus.service';
import { MenuStatus } from '../../domain/enums/menu-status.enum';

describe('MenusService', () => {
  let sut: MenusService;
  let establishmentId: string;

  beforeEach(() => {
    sut = new MenusService(new InMemoryMenuRepository());
    establishmentId = faker.string.uuid();
  });

  it('should create a Menu for an Establishment', async () => {
    const menu = await sut.create({
      establishmentId,
      name: 'Cardápio de Almoço',
    });

    expect(menu.id).toBeDefined();
    expect(menu.establishmentId).toEqual(establishmentId);
    expect(menu.status).toEqual(MenuStatus.ACTIVE);
  });

  it('should find a Menu by id', async () => {
    const menu = await sut.create({
      establishmentId,
      name: 'Cardápio de Almoço',
    });

    const found = await sut.findById(menu.id);

    expect(found.id).toEqual(menu.id);
  });

  it('should throw NotFoundError for an unknown Menu', async () => {
    await expect(sut.findById(faker.string.uuid())).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should list only Menus from the given Establishment', async () => {
    const menu = await sut.create({
      establishmentId,
      name: 'Cardápio de Almoço',
    });
    await sut.create({
      establishmentId: faker.string.uuid(),
      name: 'Cardápio de Bebidas',
    });

    const result = await sut.listByEstablishment(establishmentId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(menu.id);
  });

  it('should deactivate and activate a Menu', async () => {
    const menu = await sut.create({
      establishmentId,
      name: 'Cardápio de Almoço',
    });

    const deactivated = await sut.deactivate(menu.id);
    expect(deactivated.status).toEqual(MenuStatus.INACTIVE);

    const activated = await sut.activate(menu.id);
    expect(activated.status).toEqual(MenuStatus.ACTIVE);
  });
});
