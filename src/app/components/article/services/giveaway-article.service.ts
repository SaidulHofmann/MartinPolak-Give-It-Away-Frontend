import {Injectable, OnDestroy} from '@angular/core';
import {Article, ArticleRef} from '../../../models/article.model';
import {UserRef} from '../../../models/user.model';
import {ArticleBackendService} from './article-backend.service';
import {HttpResponseReservations, Reservation, ReservationFilter} from '../../../models/reservation.model';
import {Pager} from '../../../core/types.core';
import {PagerService} from '../../shared/services/pager.service';
import {ArticleStatus} from '../../../models/articleStatus.model';
import {ArticleStatusType} from '../../../core/enums.core';

@Injectable({ providedIn: 'root' })
export class GiveawayArticleService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public article: Article;
  public reservations: Reservation[] = [];
  public reservationFilter: ReservationFilter = new ReservationFilter();
  public pager = new Pager();

  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private articleBackend: ArticleBackendService,
    private pagerService: PagerService) {
  }

  ngOnDestroy() {
  }

  public setPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.pager.totalPages) { return; }
    this.reservationFilter.page = pageNumber;
    this.loadReservations();
  }

  private loadReservations() {
    this.articleBackend.getReservations(this.reservationFilter).subscribe((httpResponseReservations: HttpResponseReservations) => {
      this.reservations = httpResponseReservations.data.docs;
      this.pager = this.pagerService.getPager(httpResponseReservations.data.total, this.reservationFilter.page);
    });
  }

  public setReservationFilter() {
    this.reservationFilter.article = new ArticleRef(this.article._id);
    this.reservationFilter.page = 1;
    this.loadReservations();
  }

  public async updateReservationAsync(reservation: Reservation): Promise<Reservation> {
    try {
      return await this.articleBackend.updateReservation(reservation).toPromise();
    } catch (ex) {
      throw ex;
    }
  }

  public async donateAsync(reservation: Reservation, donationType: ArticleStatusType): Promise<void> {
    try {
      let articleToUpdate: Article = Object.assign({}, this.article);
      articleToUpdate.donee = new UserRef(reservation.user._id);
      articleToUpdate.status = new ArticleStatus(donationType);
      let updatedArticle: Article = await this.articleBackend.updateArticle(articleToUpdate).toPromise();
      this.article = updatedArticle;
    } catch (ex) {
      throw ex;
    }
  }
}
