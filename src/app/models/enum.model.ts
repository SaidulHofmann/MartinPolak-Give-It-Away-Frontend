import {User, UserRef} from './user.model';
import {Article} from './article.model';
import {ArticleCategory} from './articleCategory.model';
import {ArticleStatus} from './articleStatus.model';

export class EditModeEnum {
  static get CREATE() {
    return 'CREATE';
  }
  static get READ() {
    return 'READ';
  }
  static get UPDATE() {
    return 'UPDATE';
  }
  static get DELETE() {
    return 'DELETE';
  }
}



