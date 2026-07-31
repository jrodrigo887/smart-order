import { Test, TestingModule } from '@nestjs/testing';
import { CollaboratorsController } from '../collaborators.controller';
import { CollaboratorsService } from '../collaborators.service';

describe('CollaboratorsController', () => {
  let controller: CollaboratorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollaboratorsController],
      providers: [
        {
          provide: CollaboratorsService,
          useValue: {
            register: jest.fn(),
            findById: jest.fn(),
            linkUser: jest.fn(),
            listByEstablishment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CollaboratorsController>(CollaboratorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
