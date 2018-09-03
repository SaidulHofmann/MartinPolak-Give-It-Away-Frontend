import {Injectable, OnDestroy} from '@angular/core';
import {Article, ArticleFilter, HttpResponseArticles} from '../../../models/article.model';
import { Observable ,  of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {UserService} from '../../user/services/user.service';
import {IdNamePair, Pager} from '../../../core/types.core';
import {ArticleCategory, ArticleStatus} from '../../../models/index.model';
import {PagerService} from '../../shared/services/pager.service';
import {LocalDataService} from '../../shared/services/local-data.service';
import {BehaviorSubject} from 'rxjs/index';
import {ArticleBackendService} from './article-backend.service';
import {Permission} from '../../../models/permission.model';


@Injectable({ providedIn: 'root' })
export class ArticleService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public articleCategories: ArticleCategory[] = []; // articleCategoryFilter;
  public articleStatus: ArticleStatus[] = []; // articleStatusFilter;
  public sortOptions: IdNamePair[] = [];
  public pager: Pager = new Pager();
  public articleFilter: ArticleFilter = new ArticleFilter();

  private articlesSubject = new BehaviorSubject<Article[]>([]);
  public readonly articles$: Observable<Article[]> = this.articlesSubject.asObservable();
  public get articles(): Article[] {
    return this.articlesSubject.getValue();
  }
  public loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private articleBackend: ArticleBackendService,
    private userService: UserService,
    private pagerService: PagerService,
    private localDataService: LocalDataService) {

    Promise.resolve(this.initAsync());
  }

  ngOnDestroy() {
    this.loadingSubject.complete();
  }

  private async initAsync(): Promise<void> {
    try {
      this.articleCategories = await this.localDataService.getArticleCategoryFilterAsync();
      this.articleStatus = await this.localDataService.getArticleStatusFilterAsync();
      this.sortOptions = this.localDataService.getArticleSortOptions();
      this.resetFilter();
      await this.loadArticlesAsync();
    } catch (ex) {
      console.log(ex);
      Promise.reject(ex);
    }
  }

  public async loadArticlesAsync(): Promise<void> {
    try {
      this.loadingSubject.next(true);
      let articlesResponse: HttpResponseArticles = await this.articleBackend.getArticlesByFilter(this.articleFilter).toPromise();
      this.pager = await this.pagerService.getPager(articlesResponse.data.total, this.articleFilter.page);
      this.articlesSubject.next(articlesResponse.data.docs);
    } catch (ex) {
      console.log('Fehler beim Laden der Artikel.', ex);
      this.articlesSubject.next([]);
    } finally {
      this.loadingSubject.next(false);
    }
  }

  public setFilter() {
    this.articleFilter.page = 1;
  }

  public resetFilter() {
    this.articleFilter.category = this.articleCategories[0];
    this.articleFilter.status = this.articleStatus[0];
    this.articleFilter.sort = this.sortOptions[0];
    this.articleFilter.tags = '';

    this.articleFilter.includeUsersReservation = true;
    this.articleFilter.selectPublishedArticles = false;
    this.articleFilter.selectReservedArticles = false;
  }

}
