import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env-config.interface';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private readonly configService: ConfigService) {}
  getPOrt(): number {
    const port = Number(this.configService.get<number>('PORT'));
    console.log(port);

    if (!port) {
      throw new Error('PORT is not defined in the environment variables');
    }
    return port;
  }
  getNodeEnv(): string {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (!nodeEnv) {
      throw new Error('NODE_ENV is not defined in the environment variables');
    }
    return nodeEnv;
  }
  getDatabaseUrl(): string {
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    if (!dbUrl) {
      throw new Error(
        'DATABASE_URL is not defined in the environment variables',
      );
    }
    return dbUrl;
  }
}
