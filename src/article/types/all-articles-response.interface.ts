// Entities
import { TArticle } from './article.type';

export interface IAllArticlesResponse {
  articles: TArticle[];
  articlesCount: number;
}
