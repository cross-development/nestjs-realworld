// Core
import { Controller, Post, Body, UsePipes, ValidationPipe, Get, Req } from '@nestjs/common';
// Services
import { UserService } from './user.service';
// Dto
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
// Interfaces and types
import { IUserResponse } from './types/user-response.interface';
import { IExpressRequest } from '@app/types/express-request.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post('users')
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<IUserResponse> {
    const user = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(user);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
    const user = await this.userService.loginUser(loginUserDto);

    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  async currentUser(@Req() request: IExpressRequest): Promise<IUserResponse> {
    return this.userService.buildUserResponse(request.user);
  }
}
