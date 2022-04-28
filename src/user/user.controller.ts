// Core
import { Controller, Post, Body } from '@nestjs/common';
// Services
import { UserService } from './user.service';
// Dto
import { CreateUserDto } from './dto/create-user.dto';
// Interfaces and types
import { IUserResponse } from './types/user-response.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }
}
