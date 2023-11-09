import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository} from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { jwtUnvalidatedKey } from '../utils/cache-keys';
import { hashedHex } from '../utils/hash';
import { IdentitySessionEntity } from './entities/identity-session.entity';
import * as dayjs from 'dayjs';
import { CreateIdentityDto } from '../identity/dto/create-identity.dto';
import { IdentityService } from '../identity/identity.service';
import { Identity } from '../identity/entities/identity.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(IdentitySessionEntity)
    private readonly utRepository: Repository<IdentitySessionEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
    private readonly configService: ConfigService,
    private readonly identityService: IdentityService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.identityService.findOne({
      select: ['id', 'email', 'password', 'role'],
      where: { email },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    delete user.password;

    if (isMatch) return user;
    return null;
  }

  async validateToken(token: string) {
    const exists = await this.cacheService.get<boolean>(
      jwtUnvalidatedKey(token),
    );

    return !exists;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const jwtTTL = this.configService.get<number>('JWT_REFRESH_TTL');
    const hashedToken = hashedHex(refreshToken);
    const token = await this.utRepository.findOneBy({
      identityId: userId,
      refreshToken: hashedToken,
      invalidated: false,
      createdAt: MoreThanOrEqual(
        dayjs().subtract(jwtTTL, 'millisecond').toDate(),
      ),
    });

    return token ?? null;
  }

  async generateToken(user: Partial<Identity>) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_TTL'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_TTL'),
        },
      ),
    ]);

    return [accessToken, refreshToken];
  }

  async login(
    user: Identity,
    userAgent: string,
    ip: string,
    rootId?: string,
    uuid?: string,
  ) {
    const [accessToken, refreshToken] = await this.generateToken(user);
    const userToken: Partial<IdentitySessionEntity> = {
      id: uuid,
      identityId: user.id,
      refreshToken: hashedHex(refreshToken),
      token: hashedHex(accessToken),
      rootId: rootId,
      userAgent: userAgent,
      ip: ip,
    };

    await this.utRepository.save(userToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(user: Identity, userAgent: string, ip: string, token: string) {
    const hashToken = hashedHex(token.split(' ')[1]);
    const current = await this.utRepository.findOneBy({
      refreshToken: hashToken,
    });

    const uid = uuid();
    const tokens = await this.login(user, userAgent, ip, current.id, uid);

    current.invalidated = true;
    current.invalidedReason = 'refreshed';
    current.nextId = uid;
    await this.utRepository.save(current);

    return tokens;
  }

  async register(user: CreateIdentityDto) {
    const entity = await this.identityService.create(user);
    delete entity.password;
    return entity;
  }

  async logout(token: string) {
    token = token.split(' ')[1];
    const hashedToken = hashedHex(token);
    await this.utRepository.update(
      {
        token: hashedToken,
      },
      {
        invalidated: true,
        invalidedReason: 'logout',
      },
    );

    // Push to cache to invalidate token
    await this.cacheService.set(
      jwtUnvalidatedKey(token),
      true,
      this.configService.get('JWT_ACCESS_TTL'),
    );
  }
}
