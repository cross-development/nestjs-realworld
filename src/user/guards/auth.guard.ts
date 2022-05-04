// Core
import {
  HttpStatus,
  Injectable,
  CanActivate,
  HttpException,
  ExecutionContext,
} from '@nestjs/common';
// Packages
import { Observable } from 'rxjs';
// Interfaces and types
import { IExpressRequest } from '@app/shared/types/express-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IExpressRequest>();

    if (request.user) {
      return true;
    }

    throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  }
}
