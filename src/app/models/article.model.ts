import {User, UserRef} from './user.model';
import { ArticleCategory } from './articleCategory.model';
import { ArticleStatus } from './articleStatus.model';
import {articleCategories, articleStatus} from './enum.model';

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
}
