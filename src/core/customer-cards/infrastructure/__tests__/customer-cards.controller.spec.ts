import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCardsController } from '../customer-cards.controller';
import { CustomerCardsService } from '../customer-cards.service';

describe('CustomerCardsController', () => {
  let controller: CustomerCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerCardsController],
      providers: [
        {
          provide: CustomerCardsService,
          useValue: {
            open: jest.fn(),
            findById: jest.fn(),
            markInUse: jest.fn(),
            close: jest.fn(),
            cancel: jest.fn(),
            listByEstablishment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerCardsController>(CustomerCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
