import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RealIP = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = ctx.switchToHttp().getRequest()?.ip;

    return (
      request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || ip
    );
  },
);
