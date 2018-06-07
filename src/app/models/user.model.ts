import {Article} from './article.model';
import {articleCategoryFilter, articleSortOptions, articleStatusFilter} from './data.model';
import {IdNamePair} from './core.model';
import {ArticleCategory, ArticleStatus} from './index.model';

export class User {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  fullname: string;

  createdAt = null;
  updatedAt = null;

  authToken = '';
}

export class UserRef {
  public firstname: string;
  public lastname: string;
  public fullname: string;

  constructor(
    public _id: string,
  ) { }
}

export class HttpResponseUser {
  status = '';
  data: User = null;
  message = '';
}

export class HttpResponseUsers {
  status = '';
  data: HttpResponseUserData = null;
  message = '';
}

export class HttpResponseUserData {
  docs: User[] = [];
  total = 0;
  limit = 0;
  page = 0;
  pages = 0;
}

export class UserFilter {
  _id: string = '';
  email: string = '';
  firstname: string = '';
  lastname: string = '';

  filter: string = '';
  sort: string = '';
  page: number = 1;
  limit: number = 10;
  total: number = 1;
}
