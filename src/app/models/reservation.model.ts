import {UserRef} from './user.model';
import {ArticleRef} from './article.model';
import {IdNamePair} from '../core/types.core';

export class Reservation {
  _id = undefined;
  article: ArticleRef = null;
  user: UserRef = null;
  commentPublisher = '';
  commentApplicant = '';

  createdAt = new Date();
  updatedAt = new Date();
}

export class HttpResponseReservations {
  status = '';
  data: HttpResponseReservationData = null;
  message = '';

}

export class HttpResponseReservationData {
  docs: Reservation[] = [];
  total = 0;
  limit = 0;
  page = 0;
  pages = 0;
}

/**
 * Stores parameters for reservation queries.
 */
export class ReservationFilter {
  page = 1;
  limit = 100;
  article: ArticleRef = null;
  user: UserRef = null;
  sort: IdNamePair = {_id: 'createdAt', name: 'Create date asc'};
}
