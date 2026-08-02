import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemsController } from '../menu-items.controller';
import { MenuItemsService } from '../menu-items.service';

describe('MenuItemsController', () => {
  let controller: MenuItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuItemsController],
      providers: [
        {
          provide: MenuItemsService,
          useValue: {
            add: jest.fn(),
            listByMenu: jest.fn(),
            update: jest.fn(),
            markAvailable: jest.fn(),
            markUnavailable: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuItemsController>(MenuItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
