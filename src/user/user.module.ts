// Core
import { Module } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { UserEntity } from './user.entity';
// Services
import { UserService } from './user.service';
// Controllers
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserModule {}
