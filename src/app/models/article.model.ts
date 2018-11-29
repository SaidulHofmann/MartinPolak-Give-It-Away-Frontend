import {ArticleCategory, ArticleStatus, User, UserRef, Reservation} from './index.model';
import {IdNamePair} from '../core/types.core';

export class Article {

  _id = null;
  name = '';
  description = '';
  handover = '';
  overviewImage = '';
  additionalImages: string[] = [];
  tags = '';
  donationDate: Date = null;

  publisher: UserRef = null;
  donee: UserRef = null;
  category: ArticleCategory = {_id: 'others', name: 'Sonstiges'};
  status: ArticleStatus = {_id: 'available', name: 'Artikel verfügbar'};

  createdAt: Date = null; // assigned by MongoDb
  updatedAt: Date = null; // assigned by MongoDb

  userHasReservation?: boolean = false; // Virtual property assigned by backend.
  usersReservation?: Reservation = null; // Virtual property assigned by backend.
}

export class ArticleRef {
  constructor(
    public _id = null,
    public name = '') {}
}

export class HttpResponseArticles {
  status = '';
  data: HttpResponseArticleData = new HttpResponseArticleData();
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
  category: ArticleCategory = null;
  status: ArticleStatus = null;
  sort: IdNamePair = null;
  tags = '';

  page = 1;
  limit = 10;
  includeUsersReservation = false;
  selectReservedArticles = false;
  selectPublishedArticles = false;
}
