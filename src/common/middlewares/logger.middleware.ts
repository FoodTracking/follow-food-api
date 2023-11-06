import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, url } = request;
    //Get real ip through reverse proxy
    const realIp = request.headers['x-forwarded-for'] || ip;
    const hrTime = process.hrtime();

    response.on('finish', () => {
      const diff = process.hrtime(hrTime);
      const time = `${Math.round(diff[0] * 1e3 + diff[1] * 1e-6)}ms`;
      const message = `${method} ${url} | ${realIp} | ${response.statusCode} | ${time}`;
      this.logger.log(message);
    });

    next();
  }
}
