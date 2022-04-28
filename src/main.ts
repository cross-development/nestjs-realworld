// Config
!process.env.IS_TS_NODE && require('module-alias/register');
// Core
import { NestFactory } from '@nestjs/core';
// Module
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 5000;

  await app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
};

bootstrap();
