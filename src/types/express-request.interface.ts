// Packages
import { Request } from 'express';
// Entities
import { UserEntity } from '@app/user/user.entity';

export interface IExpressRequest extends Request {
  user?: UserEntity;
}
