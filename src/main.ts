import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  // setup app logs
  const logsPath = './logs';
  if (!existsSync(logsPath)) mkdirSync(logsPath);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api/v1');

  // swagger
  const config = new DocumentBuilder()
    .setTitle('social app')
    .setDescription('social app api')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const doc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, doc);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
