// Core
import { Module } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from '@app/profile/follow.entity';
// Service
import { ArticleService } from './article.service';
// Controller
import { ArticleController } from './article.controller';

@Module({
  providers: [ArticleService],
  controllers: [ArticleController],
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
})
export class ArticleModule {}
