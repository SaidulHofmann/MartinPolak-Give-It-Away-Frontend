import User from './user.model';
import Article from './article.model';
import ArticleCategory from './articleCategory.model';
import ArticleStatus from './articleStatus.model';

export default class Reservation {
  _id = '';
  article: Article = null;
  user: User = null;
  commentPublisher = '';
  commentApplicant = '';

  createdAt = new Date();
  updatedAt = new Date();
}
