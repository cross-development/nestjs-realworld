// Core
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
// Services
import { ProfileService } from './profile.service';
// Guards
import { AuthGuard } from '@app/user/guards/auth.guard';
// Decorators
import { User } from '@app/user/decorators/user.decorator';
// Interfaces and types
import { IProfileResponse } from './types/profile-response.interface';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(currentUserId, profileUserName);

    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.followProfile(currentUserId, profileUserName);

    return this.profileService.buildProfileResponse(profile);
  }

  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @User('id') currentUserId: number,
    @Param('username') profileUserName: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.unfollowProfile(currentUserId, profileUserName);

    return this.profileService.buildProfileResponse(profile);
  }
}
