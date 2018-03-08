import User from './user.model';
import ArticleCategory from './articleCategory.model';
import ArticleStatus from './articleStatus.model';

export default class Article {

  _id = '';
  name = '';
  description = '';
  handover = '';
  pictureOverview = '';
  pictures: Array<string> = [];
  videos: Array<string> = [];
  tags: Array<string> = [];
  donationDate: Date = null;

  publisher: User = null;
  donee: User = null;
  category: ArticleCategory = null;
  status: ArticleStatus = null;

  createdAt = new Date();
  updatedAt = new Date();
}
