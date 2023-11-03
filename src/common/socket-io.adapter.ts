import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { Server, ServerOptions, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthService } from '../auth/auth.service';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const optionsWithCORS: ServerOptions = {
      ...options,
    };

    const jwtService = this.app.get(JwtService);
    const authService = this.app.get(AuthService);
    const server: Server = super.createIOServer(port, optionsWithCORS);

    server
      .of('orders')
      .use(createTokenMiddleware(jwtService, authService, this.logger));

    return server;
  }
}

const createTokenMiddleware =
  (jwtService: JwtService, authService: AuthService, logger: Logger) =>
  async (socket: Socket, next: (err?: ExtendedError) => void) => {
    // for Postman testing support, fallback to token header
    const handshake = socket.handshake;
    const token = handshake.auth.token || handshake.headers['token'];
    logger.debug(`Validating auth token before connection: ${token}`);
    if (!token) {
      next(new Error('NO TOKEN'));
      return;
    }

    const isValid = await authService.validateToken(token);
    if (!isValid) {
      next(new Error('FORBIDDEN'));
      return;
    }

    try {
      const payload = jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      // @ts-ignore
      socket.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch {
      next(new Error('FORBIDDEN'));
    }
  };
