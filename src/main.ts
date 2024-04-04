import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { appConfig, AppConfig } from './app/configs/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigInstance: AppConfig = app.get(appConfig.KEY);
  await app.listen(appConfigInstance.port, () => {
    console.log(
      `🐼 Server is online: http://${appConfigInstance.host}:${appConfigInstance.port}`,
    );
  });
}
bootstrap();
