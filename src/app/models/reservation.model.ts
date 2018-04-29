import {User, UserRef} from './user.model';
import { Article} from './article.model';
import { ArticleCategory } from './articleCategory.model';
import { ArticleStatus } from './articleStatus.model';
import {IdNamePair} from './core.model';
import {articleCategoryFilter, articleSortOptions, articleStatusFilter} from './data.model';

export class Reservation {
  _id = '';
  article: Article = null;
  user: UserRef = null;
  commentPublisher = '';
  commentApplicant = '';

  createdAt = new Date();
  updatedAt = new Date();
}

/**
 * Stores parameters for article queries.
 */
export class ReservationFilter {
  page = 1;
  limit = 100;
  article: Article = null;
  user: UserRef = null;
  sort: IdNamePair = {_id: 'createdAt', name: 'Create date asc'};
}
