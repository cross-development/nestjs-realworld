// Core
import {
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UsePipes,
  UseGuards,
  Controller,
} from '@nestjs/common';
// Entities
import { UserEntity } from '@app/user/user.entity';
// Services
import { ArticleService } from './article.service';
// Dto
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
// Guards
import { AuthGuard } from '@app/user/guards/auth.guard';
// Decorators
import { User } from '@app/user/decorators/user.decorator';
// Pipes
import { BackendValidationPipe } from '@app/shared/pipes/backend-validation.pipe';
// Interfaces and types
import { IFeedQuery } from './types/feed-query.interface';
import { IArticleQuery } from './types/article-query.interface';
import { IArticleResponse } from './types/article-response.interface';
import { IAllArticlesResponse } from './types/all-articles-response.interface';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: IArticleQuery,
  ): Promise<IAllArticlesResponse> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Get('feed')
  @UseGuards(AuthGuard)
  async getFeed(
    @User('id') currentUserId: number,
    @Query() query: IFeedQuery,
  ): Promise<IAllArticlesResponse> {
    return await this.articleService.getFeed(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.createArticle(currentUser, createArticleDto);

    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  async getSingleArticle(@Param('slug') slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.findBySlug(slug);

    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@User('id') currentUserId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(currentUserId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new BackendValidationPipe())
  async updateArticle(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.updateArticle(currentUserId, slug, updateArticleDto);

    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.addArticleToFavorites(currentUserId, slug);

    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async deleteArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<IArticleResponse> {
    const article = await this.articleService.deleteArticleFromFavorites(currentUserId, slug);

    return this.articleService.buildArticleResponse(article);
  }
}
