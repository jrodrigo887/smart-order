import { faker } from '@faker-js/faker';
import { MenuItem, MenuItemProps } from '../menu-item.entity';
import { MenuItemStatus } from '../../enums/menu-item-status.enum';

describe('MenuItemEntity', () => {
  let props: MenuItemProps;
  let menuItem: MenuItem;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      menuId: faker.string.uuid(),
      productId: faker.string.uuid(),
      price: 24.5,
    };
    menuItem = MenuItem.create(props);
  });

  it('should create a valid MenuItem instance', () => {
    expect(menuItem).toBeInstanceOf(MenuItem);
    expect(menuItem.menuId).toEqual(props.menuId);
    expect(menuItem.productId).toEqual(props.productId);
    expect(menuItem.price).toEqual(props.price);
  });

  it('should default to AVAILABLE status, displayOrder 0 and not featured', () => {
    expect(menuItem.status).toEqual(MenuItemStatus.AVAILABLE);
    expect(menuItem.displayOrder).toEqual(0);
    expect(menuItem.featured).toEqual(false);
  });

  it('should mark a MenuItem unavailable and available again', () => {
    menuItem.markUnavailable();
    expect(menuItem.status).toEqual(MenuItemStatus.UNAVAILABLE);

    menuItem.markAvailable();
    expect(menuItem.status).toEqual(MenuItemStatus.AVAILABLE);
  });

  it('should update the price', () => {
    menuItem.updatePrice(30);
    expect(menuItem.price).toEqual(30);
  });

  it('should update displayOrder and featured', () => {
    menuItem.updateDisplay(3, true);
    expect(menuItem.displayOrder).toEqual(3);
    expect(menuItem.featured).toEqual(true);
  });
});
