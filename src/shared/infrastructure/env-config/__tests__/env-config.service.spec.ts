import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigModule } from '../env-config.module';
import { EnvConfigService } from '../env-config.service';

describe('EnvConfigService', () => {
  let service: EnvConfigService;
  const envVariables = process.env;

  beforeEach(async () => {
    process.env = { ...envVariables };
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    service = module.get<EnvConfigService>(EnvConfigService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return PORT = 3000', () => {
    expect(service.getPOrt()).toBe(3000);
  });

  it('should be return NODE_ENV = <ambiente>', () => {
    expect(service.getNodeEnv()).toBe(process.env.NODE_ENV);
  });

  it('should be return connection string DB', () => {
    expect(service.getDatabaseUrl()).toBe(process.env.DATABASE_URL);
  });

  it('should throw an error if PORT is not defined', () => {
    delete process.env.PORT;
    expect(() => service.getPOrt()).toThrow(
      'PORT is not defined in the environment variables',
    );
  });

  it('should throw an error if NODE_ENV is not defined', () => {
    delete process.env.NODE_ENV;
    expect(() => service.getNodeEnv()).toThrow(
      'NODE_ENV is not defined in the environment variables',
    );
  });

  it('should throw an error if DATABASE_URL is not defined', () => {
    delete process.env.DATABASE_URL;
    expect(() => service.getDatabaseUrl()).toThrow(
      'DATABASE_URL is not defined in the environment variables',
    );
  });
});
