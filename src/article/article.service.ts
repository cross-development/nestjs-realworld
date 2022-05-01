// Core
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// Packages
import slugify from 'slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
// Entities
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';
// Dto
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
// Interfaces and types
import { IArticleQuery } from './types/article-query.interface';
import { IArticleResponse } from './types/article-response.interface';
import { IAllArticlesResponse } from './types/all-articles-response.interface';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(currentUserId: number, query: IArticleQuery): Promise<IAllArticlesResponse> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({ username: query.author });

      queryBuilder.andWhere('articles.authorId = :id', { id: author.id });
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne(
        { username: query.favorited },
        { relations: ['favorites'] },
      );

      const ids = author.favorites.map((item) => item.id);

      ids.length > 0
        ? queryBuilder.andWhere('articles.id IN (:...ids)', { ids })
        : queryBuilder.andWhere('1=0');
    }

    if (query.limit) {
      queryBuilder.limit(query.limit);
    }

    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne(currentUserId, {
        relations: ['favorites'],
      });

      favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
    }

    const articles = await queryBuilder.getMany();
    const articlesWithFavorites = articles.map((article) => ({
      ...article,
      favorited: favoriteIds.includes(article.id),
    }));

    return { articles: articlesWithFavorites, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);
    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({ slug });
  }

  async deleteArticle(currentUserId: number, slug: string): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('NOT_AUTHOR', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async updateArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('NOT_AUTHOR', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async addArticleToFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, { relations: ['favorites'] });

    const isFavorite = user.favorites.find(({ id }) => id === article.id);

    if (isFavorite) {
      return article;
    }

    user.favorites.push(article);
    article.favoritesCount += 1;

    await this.userRepository.save(user);
    await this.articleRepository.save(article);
  }

  async deleteArticleFromFavorites(currentUserId: number, slug: string): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne(currentUserId, { relations: ['favorites'] });

    const articleIdx = user.favorites.findIndex(({ id }) => id === article.id);

    if (articleIdx === -1) {
      return article;
    }

    user.favorites.splice(articleIdx, 1);
    article.favoritesCount -= 1;

    await this.userRepository.save(user);
    await this.articleRepository.save(article);
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    return { article };
  }

  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
