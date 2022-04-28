// Core
import { Injectable } from '@nestjs/common';
// Packages
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// Entities
import { UserEntity } from './user.entity';
// Dto
import { CreateUserDto } from './dto/create-user.dto';
// Interfaces and types
import { IUserResponse } from './types/user-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  generateJwt(user: UserEntity) {
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): IUserResponse {
    return {
      user: { ...user, token: this.generateJwt(user) },
    };
  }
}
