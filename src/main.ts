import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  logger.log('Nest application is starting...');
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3001;
  await app.listen(port, () => {
    logger.log(`Nest application is running on: http://localhost:${port}`);
  });
}
bootstrap();
