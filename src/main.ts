import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initSwagger } from './core/utils/swagger.util';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()).enableCors();

  initSwagger(app);

  await app.listen(8080);
}

bootstrap();
