// Implements UC04-Artikel anzeigen.

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {Article, ArticleFilter, HttpResponseArticles} from '../../models/article.model';
import {Router} from '@angular/router';
import {PagerService} from '../../services/pager.service';
import {articleCategories, articleCategoryFilter, articleSortOptions,
  articleStatus, articleStatusFilter} from '../../core/data-providers.core';
import {Pager} from '../../core/types.core';
import {ArticleStatusType} from '../../core/enums.core';
import {User} from '../../models/user.model';
import {UserService} from '../../services/user.service';
import {LocalDataService} from '../../services/local-data.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit, OnDestroy {

  // Constants, variables
  // ----------------------------------
  public ArticleStatusType = ArticleStatusType;
  public articlesResponse: HttpResponseArticles = null;
  public pager: Pager = new Pager();
  articleCategories = articleCategoryFilter;
  articleStatus = articleStatusFilter;
  sortOptions = articleSortOptions;
  articleFilter: ArticleFilter = null;

  // Properties
  // ----------------------------------
  get articles() {
    if (!this.articlesResponse || !this.articlesResponse.data || !this.articlesResponse.data.docs ) {
      return [];
    }
    return this.articlesResponse.data.docs;
  }

  public get currentUser(): User {
    return this.userService.getCurrentUser();
  }

  // Methods
  // ----------------------------------
  constructor(
    private router: Router,
    private localDataService: LocalDataService,
    private userService: UserService,
    private articleService: ArticleService,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.loadArticleFilter();
    if (this.articleFilter != null) {
      this.getArticles();
    } else {
      this.articleFilter = new ArticleFilter();
      this.onResetFilter();
    }
  }

  ngOnDestroy() {
    this.localDataService.articleFilter = this.articleFilter;
    this.localDataService.SaveArticleFilter();
  }

  private loadArticleFilter() {
    this.articleFilter = this.localDataService.articleFilter;
    if (this.articleFilter != null) {
      this.articleFilter.category = articleCategoryFilter.find(c => c._id === this.articleFilter.category._id);
      this.articleFilter.status = articleStatusFilter.find(s => s._id === this.articleFilter.status._id);
      this.articleFilter.sort = articleSortOptions.find(s => s._id === this.articleFilter.sort._id);
    }
  }

  onSetPage(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.pager.totalPages) { return; }
    this.articleFilter.page = pageNumber;
    this.getArticles();
  }

  getArticles() {
    this.articleService.getArticlesByFilter(this.articleFilter).subscribe(httpResponseArticles => {
      this.articlesResponse = httpResponseArticles;
      this.pager = this.pagerService.getPager(this.articlesResponse.data.total, this.articleFilter.page);
    });
  }

  onArticleDetails(article: Article) {
    this.router.navigate([`/articles/${article._id}/details`]);
  }

  onEdit(article: Article) {
    this.router.navigate([`/articles/${article._id}/edit`]);
  }

  onGiveAway(article: Article) {
    this.router.navigate([`/articles/${article._id}/giveAway`]);
  }

  onPublicationRervationCBChange(event) {
    if (!event) { return; }
    if (event.target.id === 'inputMyPublications') {
      if (this.articleFilter.selectReservedArticles) {
        this.articleFilter.selectReservedArticles = false;
      }
    } else if (event.target.id === 'inputMyReservations') {
      if (this.articleFilter.selectPublishedArticles) {
        this.articleFilter.selectPublishedArticles = false;
      }
    }
    this.onSetFilter();
  }

  onSetFilter() {
    this.articleFilter.page = 1;
    this.getArticles();
    this.localDataService.articleFilter = this.articleFilter;
    this.localDataService.SaveArticleFilter();
  }

  onResetFilter() {
    this.articleFilter.category = articleCategoryFilter[0];
    this.articleFilter.status = articleStatusFilter[0];
    this.articleFilter.sort = articleSortOptions[0];
    this.articleFilter.tags = '';

    this.articleFilter.includeUsersReservation = true;
    this.articleFilter.selectPublishedArticles = false;
    this.articleFilter.selectReservedArticles = false;

    this.getArticles();
  }


}
