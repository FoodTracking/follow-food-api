import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/user-role.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { Identity } from '../../identity/entities/identity.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const httpContext = context.switchToHttp().getRequest();
    const wsContext = context.switchToWs().getClient();

    let user: Partial<Identity>;

    if (httpContext) {
      user = httpContext.user;
    } else if (wsContext) {
      user = wsContext.handshake.user;
    } else {
      throw new UnauthorizedException();
    }

    const hasPermission = requiredRoles.some(
      (role) => user.role?.includes(role.toString()),
    );

    if (!hasPermission) {
      if (httpContext) {
        throw new UnauthorizedException(
          `your role is not allowed to access this resource (${requiredRoles})`,
        );
      }
      if (wsContext) {
        throw new WsException('UnauthorizedException');
      }
    }

    return true;
  }
}
