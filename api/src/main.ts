import { NestFactory } from '@nestjs/core';
import { AppModule } from '@fil-rouge/api/app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const corsOrigin = config.get<string>('CORS_ORIGIN');

  if (corsOrigin) {
    app.enableCors({ origin: corsOrigin });
  }

  await app.listen(port);

  console.log(`API listening on http://localhost:${port}`);
}

void bootstrap();
