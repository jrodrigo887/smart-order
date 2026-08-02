import { faker } from '@faker-js/faker';
import { NotFoundError } from '@/shared/errors/not-found.error';
import { InMemoryMenuItemRepository } from '../repositories/in-memory-menu-item.repository';
import { MenuItemsService } from '../menu-items.service';
import { MenuItemStatus } from '../../domain/enums/menu-item-status.enum';

describe('MenuItemsService', () => {
  let sut: MenuItemsService;
  let menuId: string;
  let productId: string;

  beforeEach(() => {
    sut = new MenuItemsService(new InMemoryMenuItemRepository());
    menuId = faker.string.uuid();
    productId = faker.string.uuid();
  });

  it('should add a Product to a Menu', async () => {
    const menuItem = await sut.add({ menuId, productId, price: 24.5 });

    expect(menuItem.id).toBeDefined();
    expect(menuItem.menuId).toEqual(menuId);
    expect(menuItem.productId).toEqual(productId);
    expect(menuItem.price).toEqual(24.5);
    expect(menuItem.status).toEqual(MenuItemStatus.AVAILABLE);
  });

  it('should list only MenuItems from the given Menu', async () => {
    const menuItem = await sut.add({ menuId, productId, price: 24.5 });
    await sut.add({
      menuId: faker.string.uuid(),
      productId,
      price: 12,
    });

    const result = await sut.listByMenu(menuId);

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(menuItem.id);
  });

  it('should throw NotFoundError when updating an unknown MenuItem', async () => {
    await expect(
      sut.update(faker.string.uuid(), { price: 10 }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should update price, displayOrder and featured', async () => {
    const menuItem = await sut.add({ menuId, productId, price: 24.5 });

    const updated = await sut.update(menuItem.id, {
      price: 30,
      displayOrder: 2,
      featured: true,
    });

    expect(updated.price).toEqual(30);
    expect(updated.displayOrder).toEqual(2);
    expect(updated.featured).toEqual(true);
  });

  it('should mark a MenuItem unavailable and available again', async () => {
    const menuItem = await sut.add({ menuId, productId, price: 24.5 });

    const unavailable = await sut.markUnavailable(menuItem.id);
    expect(unavailable.status).toEqual(MenuItemStatus.UNAVAILABLE);

    const available = await sut.markAvailable(menuItem.id);
    expect(available.status).toEqual(MenuItemStatus.AVAILABLE);
  });
});
