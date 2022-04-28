// Core
import { Module } from '@nestjs/common';
// Packages
import { TypeOrmModule } from '@nestjs/typeorm';
// Module
import { TagModule } from '@app/tag/tag.module';
import { UserModule } from './user/user.module';
// Configs
import ormConfig from './ormConfig';

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule, UserModule],
})
export class AppModule {}
