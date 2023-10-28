import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './logger.middleware';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { CategoriesModule } from './categories/categories.module';
import { HttpModule } from '@nestjs/axios';
import { GeolocationModule } from './geolocation/geolocation.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { IdentityModule } from './identity/identity.module';
import { RolesGuard } from './auth/guard/roles.guard';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<string>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        synchronize: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('CACHE_HOST'),
        port: +configService.get<string>('CACHE_PORT'),
        password: configService.get<string>('CACHE_PASSWORD'),
        db: +configService.get<string>('CACHE_DB'),
        ttl: +configService.get<string>('CACHE_TTL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    HttpModule,
    RestaurantsModule,
    GeolocationModule,
    CategoriesModule,
    IdentityModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
        }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
