// Core
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Module
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';
// Middleware
import { AuthMiddleware } from './user/middleware/auth.middleware';
// Configs
import ormConfig from './ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule, UserModule, ArticleModule, ProfileModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
