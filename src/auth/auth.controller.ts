import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CurrentUser } from './decorator/current-user.decorator';
import { RealIP } from './decorator/real-ip.decorator';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Identity } from '../identity/entities/identity.entity';
import { CreateIdentityDto } from '../identity/dto/create-identity.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  async login(
    @CurrentUser() user: Identity,
    @RealIP() ip: string,
    @Headers('User-Agent') userAgent: string,
  ) {
    return this.authService.login(user, userAgent, ip);
  }

  @Post('register')
  async register(@Body() identity: CreateIdentityDto) {
    return this.authService.register(identity);
  }

  @Get('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @CurrentUser() user: Identity,
    @RealIP() ip: string,
    @Headers('User-Agent') userAgent: string,
    @Headers('Authorization') token: string,
  ) {
    return this.authService.refresh(user, userAgent, ip, token);
  }

  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('Authorization') token: string) {
    return this.authService.logout(token);
  }
}
