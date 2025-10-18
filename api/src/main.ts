import { NestFactory } from '@nestjs/core';
import { AppModule } from '@fil-rouge/api/app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  const corsOrigin = config.get<string>('CORS_ORIGIN');

  // ✅ Validation globale des DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidUnknownValues: false,
    }),
  );

  // ✅ Sérialisation uniforme
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ✅ CORS
  if (corsOrigin) {
    app.enableCors({ origin: corsOrigin });
  }

  // ✅ Swagger JSON uniquement (pas d’UI)
  if (process.env.NODE_ENV !== 'production') {
    const swaggerCfg = new DocumentBuilder()
      .setTitle('Fil-rouge API')
      .setDescription('Schéma OpenAPI pour génération des types front')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerCfg);

    // Expose uniquement le JSON du schéma
    app.getHttpAdapter().get('/docs-json', (req, res) => {
      res.json(document);
    });
  }

  await app.listen(port);
  console.log(`✅ API running on http://localhost:${port}`);
  console.log(`📄 OpenAPI JSON: http://localhost:${port}/docs-json`);
}

void bootstrap();
