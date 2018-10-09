import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Location} from '@angular/common';
import {Article} from '../../../models/article.model';
import {Reservation} from '../../../models/reservation.model';
import {User, UserRef} from '../../../models/user.model';
import {Subscription} from 'rxjs/internal/Subscription';
import {ArticleBackendService} from '../services/article-backend.service';
import {AuthService} from '../../permission/services/auth.service';
import {ArticleDetailsService} from '../services/article-details.service';
import {NavigationService} from '../../shared/services/navigation.service';


@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public get article(): Article { return this.articleDetailsSvc.article; }
  public set article(article: Article) { this.articleDetailsSvc.article = article; }

  public get currentUser(): User {
    return this.authService.getCurrentUser();
  }

  constructor(
    private authService: AuthService,
    private articleDetailsSvc: ArticleDetailsService,
    private navService: NavigationService,
    private route: ActivatedRoute) {
  }

  public ngOnInit() {
    this.subscriptions = this.route.data.subscribe(
      (data: Data) => {
        this.article = data['article'];
        if (!this.article.userHasReservation) {
          this.articleDetailsSvc.assignDefaultReservation();
        }}
    );
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public onGoBack() {
    this.navService.goBack();
  }

  public onCreateReservation() {
    this.articleDetailsSvc.createReservation();
  }

  public onUpdateReservation() {
    this.articleDetailsSvc.updateReservation();
  }

  public onDeleteReservation(): void {
    this.articleDetailsSvc.deleteReservation();
  }

}
