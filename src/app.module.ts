// Core
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Module
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from './user/user.module';
// Middleware
import { AuthMiddleware } from './user/middleware/auth.middleware';
// Configs
import ormConfig from './ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule, UserModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
