import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { SecurityModule } from './security/security.module';
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
        DOMAIN: Joi.string().allow('', null),
      }),
    }),
    UserModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
