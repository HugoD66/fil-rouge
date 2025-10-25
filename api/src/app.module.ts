import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PersonModule } from '@fil-rouge/api/person/person.module';
import { SecurityModule } from './security/security.module';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        POSTGRES_HOST: Joi.string().default('localhost'),
        POSTGRES_PORT: Joi.number().default(5432),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_SSL: Joi.boolean().default(false),
        DATABASE_URL: Joi.string().uri().optional(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const url = cfg.get<string>('DATABASE_URL');
        const ssl = cfg.get<boolean>('POSTGRES_SSL');

        return {
          type: 'postgres',
          ...(url
            ? { url }
            : {
                host: cfg.get<string>('POSTGRES_HOST'),
                port: cfg.get<number>('POSTGRES_PORT'),
                username: cfg.get<string>('POSTGRES_USER'),
                password: cfg.get<string>('POSTGRES_PASSWORD'),
                database: cfg.get<string>('POSTGRES_DB'),
              }),
          synchronize: false,
          autoLoadEntities: true,
          ssl: ssl ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    PersonModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
