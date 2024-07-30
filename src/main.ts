import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { WsAdapter } from './socket/socket.adapter';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  // setup app logs
  const logsPath = './logs';
  if (!existsSync(logsPath)) mkdirSync(logsPath);

  const app = await NestFactory.create(AppModule);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);

  const adapter = new WsAdapter(app, jwtService, userService);
  app.useWebSocketAdapter(adapter);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

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
