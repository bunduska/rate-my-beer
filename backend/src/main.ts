import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function start() {
  const port: number = parseInt(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(port);
}

start();
