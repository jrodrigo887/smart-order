import { Test, TestingModule } from '@nestjs/testing';
import { MenusController } from '../menus.controller';
import { MenusService } from '../menus.service';

describe('MenusController', () => {
  let controller: MenusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [
        {
          provide: MenusService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            listByEstablishment: jest.fn(),
            activate: jest.fn(),
            deactivate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MenusController>(MenusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
