// Core
import { Module } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Entities
import { UserEntity } from './user.entity';
// Services
import { UserService } from './user.service';
// Guards
import { AuthGuard } from './guards/auth.guard';
// Controllers
import { UserController } from './user.controller';

@Module({
  providers: [UserService, AuthGuard],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService],
})
export class UserModule {}
