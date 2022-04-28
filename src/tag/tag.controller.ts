// Core
import { Controller, Get } from '@nestjs/common';
// Services
import { TagService } from './tag.service';
// Interfaces and types
import { ITagsResponse } from './types/tag-response.interface';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<ITagsResponse> {
    const tags = await this.tagService.findAll();

    return {
      tags: tags.map(({ name }) => name),
    };
  }
}
