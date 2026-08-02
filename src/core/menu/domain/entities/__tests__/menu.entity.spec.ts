import { faker } from '@faker-js/faker';
import { Menu, MenuProps } from '../menu.entity';
import { MenuStatus } from '../../enums/menu-status.enum';

describe('MenuEntity', () => {
  let props: MenuProps;
  let menu: Menu;

  beforeEach(() => {
    props = {
      id: faker.string.uuid(),
      establishmentId: faker.string.uuid(),
      name: 'Cardápio de Almoço',
    };
    menu = Menu.create(props);
  });

  it('should create a valid Menu instance', () => {
    expect(menu).toBeInstanceOf(Menu);
    expect(menu.establishmentId).toEqual(props.establishmentId);
    expect(menu.name).toEqual(props.name);
  });

  it('should default to ACTIVE status', () => {
    expect(menu.status).toEqual(MenuStatus.ACTIVE);
  });

  it('should deactivate a Menu', () => {
    menu.deactivate();
    expect(menu.status).toEqual(MenuStatus.INACTIVE);
  });

  it('should activate an inactive Menu', () => {
    menu.deactivate();
    menu.activate();
    expect(menu.status).toEqual(MenuStatus.ACTIVE);
  });
});
