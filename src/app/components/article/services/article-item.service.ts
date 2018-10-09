import {Injectable, OnDestroy} from '@angular/core';
import {Article} from '../../../models/article.model';
import {ArticleCategory, ArticleStatus, UserRef} from '../../../models/index.model';
import {PagerService} from '../../shared/services/pager.service';
import {LocalDataService} from '../../shared/services/local-data.service';
import {ArticleBackendService} from './article-backend.service';
import {EditModeType} from '../../../core/enums.core';
import {ArticleService} from './article.service';
import {AuthService} from '../../permission/services/auth.service';


@Injectable({ providedIn: 'root' })
export class ArticleItemService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public editMode: EditModeType = EditModeType.Read;
  public articleCategories: ArticleCategory[] = [];
  public articleStatus: ArticleStatus[] = [];
  public article: Article = new Article();


  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private authService: AuthService,
    private articleBackend: ArticleBackendService,
    private articleService: ArticleService,
    private pagerService: PagerService,
    private localDataService: LocalDataService) {

    this.resetArticle();

  }

  ngOnDestroy() {
  }

  public async loadSelectionListsAsync(): Promise<void> {
    this.articleCategories = await this.localDataService.getArticleCategoryListAsync();
    this.articleStatus = await this.localDataService.getArticleStatusListAsync();
  }

  public resetArticle() {
    this.article = new Article();
    this.article.publisher = this.authService.getCurrentUser() as UserRef;
  }

  /**
   * Returns the ArticleCategory reference in the articleCategories selection list for displaying the correct entry.
   */
  public getArticleCategory(article: Article): ArticleCategory {
    if (!this.articleCategories) { return; }
    if (!article.category || !article.category._id) { return  this.articleCategories[0] ; } // default value
    return this.articleCategories.find(category => category._id === article.category._id);
  }

  /**
   * Returns the ArticleStatus reference in the articleStatus selection list for displaying the correct entry.
   */
  public getArticleStatus(article: Article): ArticleStatus {
    if (!this.articleStatus) { return; }
    if (!article.status || !article.status._id) { return  this.articleStatus[0] ; } // default value
    return this.articleStatus.find(status => status._id === article.status._id);
  }

  /**
   * Returns a new article object from formControl values.
   */
  private getArticleToSave(articleFormValue: Article): Article {
    const articleToSave = Object.assign(new Article(), articleFormValue);

    // Change view-model properties to model properties.
    if (articleToSave.publisher && !articleToSave.publisher._id) {
      articleToSave.publisher = null;
    }
    if (articleToSave.donee && !articleToSave.donee._id) {
      articleToSave.donee = null;
    }

    // Trim strings
    articleToSave.name = articleToSave.name.trim();
    articleToSave.description = articleToSave.description.trim();
    articleToSave.handover = articleToSave.handover.trim();
    articleToSave.tags = articleToSave.tags.trim();

    return articleToSave;
  }

  public async createArticleAsync(articleFormValue: Article): Promise<void> {
    try {
      const articleToSave = this.getArticleToSave(articleFormValue);
      this.article = await this.articleBackend.createArticle(articleToSave).toPromise();
      this.editMode = EditModeType.Update;
      this.articleService.loadArticlesAsync();
    } catch (ex) {
      throw ex;
    }
  }

  public async updateArticleAsync(articleFormValue: Article): Promise<void> {
    try {
      const articleToSave = this.getArticleToSave(articleFormValue);
      this.article = await this.articleBackend.updateArticle(articleToSave).toPromise();
      this.articleService.loadArticlesAsync();
    } catch (ex) {
      throw ex;
    }
  }

}
