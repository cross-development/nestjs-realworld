// Core
import { Injectable } from '@nestjs/common';
// Packages
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// Entities
import { TagEntity } from './tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {}

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }
}
