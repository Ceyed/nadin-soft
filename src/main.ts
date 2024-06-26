import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { AVATAR_UPLOAD_DIRECTORY, TASK_ATTACHMENT_UPLOAD_DIRECTORY } from 'libs/src';
import { AppModule } from './app/app.module';
import { appConfig, AppConfig } from './app/configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // * Active global pipes
  app.useGlobalPipes(new ValidationPipe());

  // * Serve static files from the 'files' directory
  app.use(
    TASK_ATTACHMENT_UPLOAD_DIRECTORY.substring(1),
    express.static(TASK_ATTACHMENT_UPLOAD_DIRECTORY),
  );
  app.use(AVATAR_UPLOAD_DIRECTORY.substring(1), express.static(AVATAR_UPLOAD_DIRECTORY));

  // * Set a prefix to all routes
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // * Introduce appConfig
  const appConfigInstance: AppConfig = app.get(appConfig.KEY);

  // * Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Nadin-Soft')
    .setDescription('The Nadin-Soft API description')
    .addBearerAuth()
    .addServer(`http://${appConfigInstance.host}:${appConfigInstance.port}`)
    .addServer(`http://localhost:${appConfigInstance.port}`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  // * Start server
  await app.listen(appConfigInstance.port);

  console.log();
  Logger.log(
    `🐼 Server is online at: http://${appConfigInstance.host}:${appConfigInstance.port}/${globalPrefix}`,
  );
  Logger.log(
    `Swagger documentation at: http://${appConfigInstance.host}:${appConfigInstance.port}/${globalPrefix}/docs`,
  );
}
bootstrap();
