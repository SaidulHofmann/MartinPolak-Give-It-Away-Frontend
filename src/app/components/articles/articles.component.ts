// Implements UC04-Artikel anzeigen.

import {Component, OnInit} from '@angular/core';
import {ArticleService} from '../../services/article.service';
import {HttpClient} from '@angular/common/http';
import {Article, ArticleFilter, HttpResponseArticles} from '../../models/article.model';
import {Router} from '@angular/router';
import {PagerService} from '../../services/pager.service';
import {articleCategories, articleCategoryFilter, articleSortOptions, articleStatus, articleStatusFilter} from '../../models/data.model';
import {IdNamePair} from '../../models/core.model';
import {ArticleCategory} from '../../models/articleCategory.model';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  // Constants, variables
  // ----------------------------------
  articlesResponse: HttpResponseArticles = null;
  pager: any = {};
  articleCategories = articleCategoryFilter;
  articleStatus = articleStatusFilter;
  sortOptions = articleSortOptions;
  articleFilter: ArticleFilter = new ArticleFilter();

  // Properties
  // ----------------------------------
  get articles() {
    if (!this.articlesResponse || !this.articlesResponse.data || !this.articlesResponse.data.docs ) {
      return [];
    }
    return this.articlesResponse.data.docs;
  }

  // Methods
  // ----------------------------------
  constructor(
    private http: HttpClient,
    private router: Router,
    private articleService: ArticleService,
    private pagerService: PagerService) { }

  ngOnInit() {
    this.getArticles();
  }

  setPage(pageNumber: number) {
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

  onSetFilter() {
    this.articleFilter.page = 1;
    this.getArticles();
  }

  onResetFilter() {
    this.articleFilter.category = articleCategoryFilter[0];
    this.articleFilter.status = articleStatusFilter[0];
    this.articleFilter.sort = articleSortOptions[0];
    this.articleFilter.tags = '';
    this.getArticles();
  }


}
