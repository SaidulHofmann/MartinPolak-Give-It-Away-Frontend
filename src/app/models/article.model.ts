import {ArticleCategory, ArticleStatus, User, UserRef, Reservation} from './index.model';
import {articleCategories, articleCategoryFilter, articleStatus, articleStatusFilter, articleSortOptions} from './data.model';
import {IdNamePair} from './core.model';

export class Article {

  _id = null;
  name = '';
  description = '';
  handover = '';
  pictureOverview = '';
  pictures: string[] = [];
  videos: string[] = [];
  tags = '';
  donationDate: Date = null;

  publisher: UserRef = null;
  donee: UserRef = null;
  category: ArticleCategory = articleCategories[0];
  status: ArticleStatus = articleStatus[0];

  createdAt: Date = null; // assigned by MongoDb
  updatedAt: Date = null; // assigned by MongoDb

  userHasReservation? = false; // Virtual property assigned by backend.
  usersReservation?: Reservation = null; // Virtual property assigned by backend.
}

export class ArticleRef {
  _id = null;
  name = '';
}

export class HttpResponseArticles {
  status = '';
  data: HttpResponseArticleData = null;
  message = '';

}

export class HttpResponseArticleData {
  docs: Article[] = [];
  total = 0;
  limit = 0;
  page = 0;
  pages = 0;
}

/**
 * Stores parameters for article queries.
 */
export class ArticleFilter {
  name = '';
  category: ArticleCategory = articleCategoryFilter[0];
  status: ArticleStatus = articleStatusFilter[0];
  sort: IdNamePair = articleSortOptions[0];
  tags = '';

  page = 1;
  limit = 10;
  includeUsersReservation = false;
  selectReservedArticles = false;
  selectPublishedArticles = false;
}
