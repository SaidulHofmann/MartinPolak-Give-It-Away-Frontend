import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Article} from '../../../models/article.model';
import {User} from '../../../models/user.model';
import {Subscription} from 'rxjs/internal/Subscription';
import {AuthService} from '../../permission/services/auth.service';
import {ArticleDetailsService} from '../services/article-details.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {imageUrlBackend} from '../../../core/globals.core';


@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit, OnDestroy {
  public imageUrlBackend: string = imageUrlBackend;
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
