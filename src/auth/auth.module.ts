import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { CurrentUserMiddleware } from 'src/middlewares/current-user.middleware';
import { MiddlewareConsumer } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    UsersModule,
    RedisModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshStrategy,
    {
      provide: 'JWT_SECRET_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get('JWT_SECRET_KEY'),
      inject: [ConfigService],
    },
    {
      provide: 'JWT_EXPIRESIN',
      useFactory: (configService: ConfigService) =>
        configService.get('JWT_EXPIRESIN'),
      inject: [ConfigService],
    },
    {
      provide: 'REFRESH_SECRET_KEY',
      useFactory: (configService: ConfigService) =>
        configService.get('REFRESH_SECRET_KEY'),
      inject: [ConfigService],
    },
    {
      provide: 'REFRESH_EXPIRESIN',
      useFactory: (configService: ConfigService) =>
        configService.get('REFRESH_EXPIRESIN'),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {
  //set middleware global for all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
