import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private service: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User | never> {
    const user = await this.service.validateUser(email.toLowerCase(), password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
