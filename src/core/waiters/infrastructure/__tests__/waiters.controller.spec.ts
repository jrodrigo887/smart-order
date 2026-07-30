import { Test, TestingModule } from '@nestjs/testing';
import { WaitersController } from '../waiters.controller';
import { WaitersService } from '../waiters.service';

describe('WaitersController', () => {
  let controller: WaitersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitersController],
      providers: [
        {
          provide: WaitersService,
          useValue: {
            register: jest.fn(),
            findById: jest.fn(),
            linkUser: jest.fn(),
            listByRestaurant: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WaitersController>(WaitersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
