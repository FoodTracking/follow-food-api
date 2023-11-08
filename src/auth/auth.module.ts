import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshStrategy } from './strategy/refresh.strategy';
import { IdentitySessionEntity } from './entities/identity-session.entity';
import { IdentityModule } from '../identity/identity.module';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([IdentitySessionEntity]),
    IdentityModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
