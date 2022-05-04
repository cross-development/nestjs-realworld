// Core
import { Injectable, NestMiddleware } from '@nestjs/common';
// Packages
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
// Services
import { UserService } from '../user.service';
// Interfaces and types
import { IExpressRequest } from '@app/shared/types/express-request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: IExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();

      return;
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
      const user = await this.userService.findById(decode.id);

      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
