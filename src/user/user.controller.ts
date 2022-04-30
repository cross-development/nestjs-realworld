// Core
import {
  Get,
  Put,
  Body,
  Post,
  UsePipes,
  UseGuards,
  Controller,
  ValidationPipe,
} from '@nestjs/common';
// Entities
import { UserEntity } from './user.entity';
// Services
import { UserService } from './user.service';
// Guards
import { AuthGuard } from './guards/auth.guard';
// Dto
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Decorators
import { User } from './decorators/user.decorator';
// Interfaces and types
import { IUserResponse } from './types/user-response.interface';

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
  @UseGuards(AuthGuard)
  async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
    return this.userService.buildUserResponse(user);
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<IUserResponse> {
    const user = await this.userService.updateUser(currentUserId, updateUserDto);

    return this.userService.buildUserResponse(user);
  }
}
