import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/user-role.dto';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { User } from '../../users/entities/user.entity';

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

    const request: Request & { user: User } = context
      .switchToHttp()
      .getRequest();

    const hasPermission = requiredRoles.some(
      (role) => request.user.role?.includes(role.toString()),
    );

    if (!hasPermission) throw new UnauthorizedException();
    return true;
  }
}