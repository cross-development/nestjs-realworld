// Core
import { Module } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { TagEntity } from './tag.entity';
// Services
import { TagService } from './tag.service';
// Controllers
import { TagController } from './tag.controller';

@Module({
  providers: [TagService],
  controllers: [TagController],
  imports: [TypeOrmModule.forFeature([TagEntity])],
})
export class TagModule {}
