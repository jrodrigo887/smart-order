import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            listByEstablishment: jest.fn(),
            discontinue: jest.fn(),
            reactivate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
