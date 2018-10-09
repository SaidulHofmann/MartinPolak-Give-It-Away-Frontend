// Implements UC04-Artikel anzeigen.

import {Component, OnInit} from '@angular/core';
import {ArticleService} from './services/article.service';
import {ArticleStatusType} from '../../core/enums.core';
import {NavigationService} from '../shared/services/navigation.service';
import {AuthService} from '../permission/services/auth.service';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  public ArticleStatusType = ArticleStatusType;

  constructor(
    public authService: AuthService,
    public navService: NavigationService,
    public articleService: ArticleService) {
  }

  public ngOnInit() {
    if (this.articleService.articles.length === 0) {
      this.articleService.loadArticlesAsync();
    }
  }

  public onSetPage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.articleService.pager.totalPages) { return; }
    this.articleService.articleFilter.page = pageNumber;
    this.articleService.loadArticlesAsync();
  }

  public onPublicationReservationCBChange(event): void {
    if (!event) { return; }
    if (event.target.id === 'myPublicationsInput') {
      if (this.articleService.articleFilter.selectReservedArticles) {
        this.articleService.articleFilter.selectReservedArticles = false;
      }
    } else if (event.target.id === 'myReservationsInput') {
      if (this.articleService.articleFilter.selectPublishedArticles) {
        this.articleService.articleFilter.selectPublishedArticles = false;
      }
    }
    this.onSetFilter();
  }

  public onSetFilter(): void {
    this.articleService.setFilter();
    this.articleService.loadArticlesAsync();
  }

  public onResetFilter(): void {
    this.articleService.resetFilter();
    this.articleService.loadArticlesAsync();
  }


}
