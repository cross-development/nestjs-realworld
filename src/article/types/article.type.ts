// Entities
import { ArticleEntity } from '../article.entity';

export type TArticle = Omit<ArticleEntity, 'updateTimestamp'>;
