import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: string, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest()?.user;
    return user;
  },
);
