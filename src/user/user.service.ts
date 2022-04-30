// Core
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Packages
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// Entities
import { UserEntity } from './user.entity';
// Dto
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Interfaces and types
import { IUserResponse } from './types/user-response.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({ email: createUserDto.email });
    const userByUsername = await this.userRepository.findOne({ username: createUserDto.username });

    if (userByEmail || userByUsername) {
      throw new HttpException('EMAIL_OR_USERNAME_ARE_TAKEN', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();

    Object.assign(newUser, createUserDto);

    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      { email: loginUserDto.email },
      { select: ['id', 'username', 'email', 'bio', 'image', 'password'] },
    );

    if (!user) {
      throw new HttpException('CREDENTIALS_ARE_NOT_VALID', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('CREDENTIALS_ARE_NOT_VALID', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    delete user.password;

    return user;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(userId);

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
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
