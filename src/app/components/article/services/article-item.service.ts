import {Injectable, OnDestroy} from '@angular/core';
import {Article} from '../../../models/article.model';
import {ArticleCategory, ArticleStatus, UserRef} from '../../../models/index.model';
import {PagerService} from '../../shared/services/pager.service';
import {DataService} from '../../shared/services/data.service';
import {ArticleBackendService} from './article-backend.service';
import {EditModeType} from '../../../core/enums.core';
import {ArticleService} from './article.service';
import {AuthService} from '../../permission/services/auth.service';
import {ErrorDetails, FileDeleteReport, FileProcessingStatus, FileUploadReport} from '../../../core/types.core';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {defaultImageName, imageUrlFrontend} from '../../../core/globals.core';
import {Permission} from '../../../models/permission.model';


@Injectable({ providedIn: 'root' })
export class ArticleItemService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public editMode: EditModeType = EditModeType.Read;
  public articleCategories: ArticleCategory[] = [];
  public articleStatus: ArticleStatus[] = [];
  public article: Article = new Article();

  public imagesToUploadMap: Map<string, File> = new Map<string, File>(); // <fileName, imageFile>.
  public imagesToDeleteSet: Set<string> = new Set<string>(); // fileName.
  public hoveredImage: string = '';
  public hoveredImageUrl: string = '';
  public defaultImage: string = defaultImageName;
  public defaultImageUrl: string = `${imageUrlFrontend}/${defaultImageName}`;


  // Properties
  // ----------------------------------
  public get hasFilesToUpload(): boolean { return this.imagesToUploadMap && this.imagesToUploadMap.size > 0; }
  public get hasFilesToDelete(): boolean { return this.imagesToDeleteSet && this.imagesToDeleteSet.size > 0; }
  public get canDeleteArticle() {
    if ((this.editMode === EditModeType.Update
      || this.editMode === EditModeType.Delete)
      && this.authService.canDeleteArticle(this.article)) {
        return true;
    } else {
      return false;
    }
  }

  // Methods
  // ----------------------------------
  constructor(
    private authService: AuthService,
    private articleBackend: ArticleBackendService,
    private articleService: ArticleService,
    private pagerService: PagerService,
    private dataService: DataService) {

    this.resetArticle();

  }

  ngOnDestroy() {
  }

  public async loadSelectionListsAsync(): Promise<void> {
    this.articleCategories = await this.dataService.getArticleCategoryListAsync();
    this.articleStatus = await this.dataService.getArticleStatusListAsync();
  }

  public resetArticle() {
    this.article = new Article();
    this.article.publisher = this.authService.currentUser as UserRef;
    this.hoveredImage = '';
    this.hoveredImageUrl = '';
    this.imagesToUploadMap.clear();
    this.imagesToDeleteSet.clear();
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

  public async deleteArticleAsync(): Promise<Article> {
    let currentEditMode = this.editMode;
    try {
      this.editMode = EditModeType.Delete;
      let deletedArticle: Article = await this.articleBackend.deleteArticle(this.article).toPromise();
      this.articleService.loadArticlesAsync();
      this.article = new Article();
      this.editMode = EditModeType.Create;
      return deletedArticle;
    } catch (ex) {
      this.editMode = currentEditMode;
      return Promise.reject(ex);
    }
  }

  public async uploadImages(): Promise<FileUploadReport> {
    console.log('@ArticleItemService.uploadImages()');
    let uploadReport: FileUploadReport = new FileUploadReport();
    let articleId = this.article._id;

    if (!this.imagesToUploadMap || this.imagesToUploadMap.size === 0) {
      throw Error('Es wurden keine Bilder für den Upload selektiert.');
    }
    if (!articleId) {
      throw Error('Für den Upload von Bildern zu einem Artikel muss der Artikel erstellt und die Artikel-Id bekannt sein.');
    }

    for (let [fileName, file] of this.imagesToUploadMap) {
      try {
        await this.dataService.uploadArticleImage(file, articleId);
        uploadReport.fileStatusMap.set(fileName, new FileProcessingStatus(true));
      } catch (errorResponse) {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        uploadReport.fileStatusMap.set(fileName, new FileProcessingStatus(false, errorDetails.message));
        uploadReport.hasFailedEntries = true;
      }
    }
    this.imagesToUploadMap.clear();
    return uploadReport;
  }

  public async deleteImages(): Promise<FileDeleteReport> {
    console.log('@ArticleItemService.deleteImages()');
    let deleteReport: FileDeleteReport = new FileDeleteReport();
    let articleId = this.article._id;

    if (!this.imagesToDeleteSet || this.imagesToDeleteSet.size === 0) {
      throw Error('Es wurden keine Bilder zum Entfernen ausgewählt.');
    }
    if (!articleId) {
      throw Error('Für das Entfernen von Bildern zu einem Artikel muss der Artikel erstellt und die Artikel-Id bekannt sein.');
    }

    for (let fileName of this.imagesToDeleteSet) {
      try {
        await this.dataService.deleteArticleImage(fileName, articleId);
        deleteReport.fileStatusMap.set(fileName, new FileProcessingStatus(true));
      } catch (errorResponse) {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        deleteReport.fileStatusMap.set(fileName, new FileProcessingStatus(false, errorDetails.message));
        deleteReport.hasFailedEntries = true;
      }
    }
    this.imagesToDeleteSet.clear();
    return deleteReport;
  }

  public getArticleStatusHoverText(): string {
    return `Das Ändern des Artikel Status wird zurzeit nicht unterstützt, da die Verwaltung von Reservationen in diesem Dialog zurzeit nicht vorgesehen ist.`;
  }

}
