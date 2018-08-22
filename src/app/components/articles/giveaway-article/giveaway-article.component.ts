import { Component, OnInit } from '@angular/core';
import {Article} from '../../../models/index.model';
import {ActivatedRoute, Data} from '@angular/router';
import {ArticleService} from '../services/article.service';
import {HttpResponseReservations, ReservationFilter, Reservation} from '../../../models/reservation.model';
import {PagerService} from '../../shared/services/pager.service';
import {ArticleRef} from '../../../models/article.model';
import {ArticleStatusType} from '../../../core/enums.core';
import {User, UserRef} from '../../../models/user.model';
import {UserService} from '../../users/services/user.service';
import {ArticleStatus} from '../../../models/articleStatus.model';
import {Location} from '@angular/common';
import {Pager} from '../../../core/types.core';

@Component({
  selector: 'app-giveaway-article',
  templateUrl: './giveaway-article.component.html',
  styleUrls: ['./giveaway-article.component.scss']
})
export class GiveawayArticleComponent implements OnInit {

  // Constants, variables
  // ----------------------------------
  ArticleStatusType = ArticleStatusType;
  public reservationsResponse: HttpResponseReservations = null;
  public article: Article;
  private reservationFilter: ReservationFilter = new ReservationFilter();
  public pager = new Pager();

  // Properties
  // ----------------------------------
  public get reservations() {
    if (!this.reservationsResponse || !this.reservationsResponse.data || !this.reservationsResponse.data.docs ) {
      return [];
    }
    return this.reservationsResponse.data.docs;
  }

  // Methods
  // ----------------------------------
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private pagerService: PagerService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data: Data) => { this.article = data['article'];
        this.onSetFilter();
    });
  }

  public onGoBack() {
    this.location.back();
  }

  onSetPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.pager.totalPages) { return; }
    this.reservationFilter.page = pageNumber;
    this.getReservations();
  }

  getReservations() {
    this.articleService.getReservations(this.reservationFilter).subscribe(httpResponseReservations => {
      this.reservationsResponse = httpResponseReservations;
      this.pager = this.pagerService.getPager(this.reservationsResponse.data.total, this.reservationFilter.page);
    });
  }

  onSetFilter() {
    this.reservationFilter.article = new ArticleRef(this.article._id);
    this.reservationFilter.page = 1;
    this.getReservations();
  }

  public onUpdateReservation(reservation: Reservation) {
    this.articleService.updateReservation(reservation).subscribe(
      (savedReservation: Reservation) => {
        console.log('GiveawayArticleComponent.onUpdateReservation(): savedReservation: ', savedReservation) ;
      }
    );
  }

  onDonateProvisionally(reservation: Reservation) {
    let articleToUpdate = Object.assign({}, this.article);
    articleToUpdate.donee = new UserRef(reservation.user._id);
    articleToUpdate.status = new ArticleStatus(this.ArticleStatusType.handoverPending);
    this.articleService.updateArticle(articleToUpdate).subscribe(
      (updatedArticle: Article) => {
        this.article = updatedArticle;
      }
    );
  }

  onDonateDefinitely(reservation: Reservation) {
    let articleToUpdate = Object.assign({}, this.article);
    articleToUpdate.donee = new UserRef(reservation.user._id);
    articleToUpdate.status = new ArticleStatus(this.ArticleStatusType.donated);
    articleToUpdate.donationDate = new Date();
    this.articleService.updateArticle(articleToUpdate).subscribe(
      (updatedArticle: Article) => {
        this.article = updatedArticle;
      }
    );
  }

}
