import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configSW = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('Api v1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, configSW);
  const logger = new Logger('Main');
  logger.log('Swagger is starting...');
  SwaggerModule.setup('api', app, documentFactory);
  logger.log('Nest application is starting...');
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3001;
  await app.listen(port, () => {
    logger.log(`Nest application is running on: http://localhost:${port}`);
  });
}
bootstrap();
