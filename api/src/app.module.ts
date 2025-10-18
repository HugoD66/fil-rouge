import { Module } from '@nestjs/common';
import { AppController } from '@fil-rouge/api/app.controller';
import { AppService } from '@fil-rouge/api/app.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? ['.env.prod', '.env']
          : ['.env', '.env.local'],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        CORS_ORIGIN: Joi.string().allow('', null),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
