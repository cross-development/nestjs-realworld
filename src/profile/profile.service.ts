// Core
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Packages
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// Entities
import { FollowEntity } from './follow.entity';
import { UserEntity } from '@app/user/user.entity';
// Interfaces and types
import { TProfile } from './types/profile.type';
import { IProfileResponse } from './types/profile-response.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(currentUserId: number, profileUserName: string): Promise<TProfile> {
    const user = await this.userRepository.findOne({ username: profileUserName });

    if (!user) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    return { ...user, following: Boolean(follow) };
  }

  async followProfile(currentUserId: number, profileUserName: string): Promise<TProfile> {
    const user = await this.userRepository.findOne({ username: profileUserName });

    if (!user) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    if (!follow) {
      const followToCreate = new FollowEntity();

      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;

      await this.followRepository.save(followToCreate);
    }

    return { ...user, following: true };
  }

  async unfollowProfile(currentUserId: number, profileUserName: string): Promise<TProfile> {
    const user = await this.userRepository.findOne({ username: profileUserName });

    if (!user) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }

    await this.followRepository.delete({ followerId: currentUserId, followingId: user.id });

    return { ...user, following: false };
  }

  buildProfileResponse(profile: TProfile): IProfileResponse {
    delete profile.email;

    return { profile };
  }
}
