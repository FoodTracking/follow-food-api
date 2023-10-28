import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Identity } from '../../identity/entities/identity.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private service: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Identity | never> {
    const user = await this.service.validateUser(email.toLowerCase(), password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
