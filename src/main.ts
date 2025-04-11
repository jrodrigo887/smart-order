import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { existsSync, unlinkSync } from 'fs';
async function bootstrap() {
  const dbSqlite = 'db.sqlite';
  if (existsSync(dbSqlite)) {
    unlinkSync(dbSqlite);
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
