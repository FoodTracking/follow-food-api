import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from './decorator/current-user.decorator';
import { RealIP } from './decorator/real-ip.decorator';
import { CreateUserDto, createUserSchema } from '../users/dto/create-user.dto';
import { ZodValidationPipe } from '../pipes/zod.pipe';
import { RefreshAuthGuard } from './guard/refresh-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @RealIP() ip: string,
    @Headers('User-Agent') userAgent: string,
  ) {
    return this.authService.login(user, userAgent, ip);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Get('refresh')
  @UseGuards(RefreshAuthGuard)
  async refresh(
    @CurrentUser() user: User,
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
