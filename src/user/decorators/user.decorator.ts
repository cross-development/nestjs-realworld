// Core
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// Interfaces and types
import { IExpressRequest } from '@app/shared/types/express-request.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<IExpressRequest>();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
