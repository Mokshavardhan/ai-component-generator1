// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 👇 Add this line to enable CORS
  app.enableCors();

  await app.listen(3002);
}
bootstrap();