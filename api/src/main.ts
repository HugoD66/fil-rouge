import { NestFactory } from '@nestjs/core';
import { AppModule } from '@fil-rouge/api/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ValidationPipe,
  ClassSerializerInterceptor,
  INestApplication,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = Number(config.get('PORT')) || 3000;
  const domain = config.get<string>('DOMAIN') ?? undefined;
  const corsOrigin = config.get<string>('CORS_ORIGIN') || undefined;

  configureGlobalValidationAndSerialization(app);

  if (corsOrigin) {
    app.enableCors({ origin: corsOrigin });
  }

  await configureSwaggerIfDev(app);

  await app.listen(port);

  console.log(`✅ API running on http://${domain}:${port}`);
  console.log(`📄 OpenAPI JSON: http://${domain}:${port}/docs-json`);
}

async function configureSwaggerIfDev(
  app: INestApplication<any>,
): Promise<void> {
  if (process.env.NODE_ENV !== 'production') {
    const swaggerCfg = new DocumentBuilder()
      .setTitle('Fil-rouge API')
      .setDescription('Schéma OpenAPI pour génération des types front')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerCfg);

    app
      .getHttpAdapter()
      .get('/docs-json', (req: Request, res: Response): void => {
        res.type('application/json').send(document);
      });

    try {
      const { writeFileSync } = await import('fs');
      writeFileSync('openapi.json', JSON.stringify(document, null, 2), 'utf-8');

      console.log('📝 openapi.json généré au démarrage (dev)');
    } catch (e) {
      console.error('Impossible d’écrire openapi.json :', e);
    }
  }
}

function configureGlobalValidationAndSerialization(
  app: INestApplication<any>,
): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

void bootstrap();
