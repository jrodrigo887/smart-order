import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigService } from './env-config.service';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';

@Module({
  providers: [EnvConfigService],
})
export class EnvConfigModule extends ConfigModule {
  static async forRoot(
    options: ConfigModuleOptions = {},
  ): Promise<DynamicModule> {
    return await super.forRoot({
      envFilePath: [
        join(__dirname, '..', '..', '..', '..', `.env.${process.env.NODE_ENV}`),
      ],
      ...options,
    });
  }
}
