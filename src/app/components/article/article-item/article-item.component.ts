// Creates a new article. UC3.1-Artikel erfassen.

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Article, ArticleCategory, ArticleStatus, User, UserRef } from '../../../models/index.model';
import {UserService} from '../../user/services/user.service';
import {DialogResultType, EditModeType} from '../../../core/enums.core';
import {DialogService} from '../../shared/services/dialog.service';
import {ArticleBackendService} from '../services/article-backend.service';
import {LocalDataService} from '../../shared/services/local-data.service';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../../shared/services/can-deactivate-guard.service';
import { Observable ,  of, throwError } from 'rxjs';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent implements OnInit, OnChanges, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables
  // ----------------------------------
  public EditModeType = EditModeType;
  @Input()
  public editMode: EditModeType = EditModeType.Read;
  @Input()
  public article: Article;

  public articleForm: FormGroup;
  public articleCategories = null;
  public articleStatus = null;

  // Properties
  // ----------------------------------

  // FormControl Getters
  public get name() { return this.articleForm.get('name'); }
  public get description() { return this.articleForm.get('description'); }
  public get handover() { return this.articleForm.get('handover'); }
  public get pictureOverview() { return this.articleForm.get('pictureOverview'); }
  public get pictures(): FormArray { return this.articleForm.get('pictures') as FormArray; }
  public get videos(): FormArray { return this.articleForm.get('videos') as FormArray; }


  // Methods
  // ----------------------------------

  constructor(
    private formBuilder: FormBuilder,
    private articleBackend: ArticleBackendService,
    private localDataService: LocalDataService,
    private userService: UserService,

    private location: Location,
    private dialogService: DialogService) {
  }

  public ngOnInit() {
    if (!this.article) {
      this.resetArticle();
    }
    this.createForm();
    this.initAsync();
  }

  private async initAsync(): Promise<void> {
    this.articleCategories = await this.localDataService.getArticleCategoryListAsync();
    this.articleStatus = await this.localDataService.getArticleStatusListAsync();
    this.updateForm();
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.articleForm.dirty) { return true; }

    return new Promise((resolve, reject) => {
      this.dialogService.askForLeavePageWithUnsavedChanges().subscribe(dialogResult => {
          resolve(dialogResult === DialogResultType.Yes);
      });
    });
  }

  /**
   * Updates the article form on @Input() Property Change.
   */
  public ngOnChanges() {
    this.updateForm();
  }

  private resetArticle() {
    this.article = new Article();
    this.article.publisher = this.userService.getCurrentUser() as UserRef;
  }

  /**
   * Creates the article form for displaying and editing articles.
   */
  private createForm() {
    // Article
    this.articleForm =    this.formBuilder.group({
      _id:                this.article._id || null,
      category:           this.getArticleCategory(this.article),
      name:               [this.article.name || '', Validators.required ],
      description:        [this.article.description || '', Validators.required ],
      handover:           [this.article.handover || '', Validators.required ],

      pictureOverview:    this.article.pictureOverview || '',
      pictures:           this.formBuilder.array( []),
      videos:             this.formBuilder.array( []),
      tags:               this.article.tags || '',
      status:             this.getArticleStatus(this.article) || null,

      // Give away
      donee:              this.formBuilder.group({
        _id:              this.article.donee ? this.article.donee._id : null,
        fullname:         this.article.donee ? this.article.donee.fullname : ''
      }),
      donationDate:       this.article.donationDate || null,

      // Publishing
      publisher:          this.formBuilder.group({
        _id:              [this.article.publisher ? this.article.publisher._id : null, Validators.required ],
        fullname:         this.article.publisher ? this.article.publisher.fullname : ''
      }),
      createdAt:          this.article.createdAt || null,
      updatedAt:          this.article.updatedAt || null
    });

    this.setPictures(this.article.pictures);
    this.setVideos(this.article.videos);
  }

  /**
   * Sets the article values to the form controls.
   */
  private updateForm() {
    if (!this.article) { return; }

    this.articleForm.reset({
      _id:                this.article._id || null,
      category:           this.getArticleCategory(this.article),
      name:               this.article.name || '',
      description:        this.article.description || '',
      handover:           this.article.handover || '',

      pictureOverview:    this.article.pictureOverview || '',
      tags:               this.article.tags || '',
      status:             this.getArticleStatus(this.article),
      donee:              {
        _id:              this.article.donee ? this.article.donee._id : null,
        fullname:        this.article.donee ? this.article.donee.fullname : ''
      },
      donationDate:       this.article.donationDate || null,

      publisher:          {
        _id:              this.article.publisher ? this.article.publisher._id : null,
        fullname:        this.article.publisher ? this.article.publisher.fullname : ''
      },
      createdAt:          this.article.createdAt || null,
      updatedAt:          this.article.updatedAt || null,
    });

    this.setPictures(this.article.pictures);
    this.setVideos(this.article.videos);
  }

  /**
   * Returns the ArticleCategory entry in the articleCategories selection list for displaying the correct entry.
   */
  private getArticleCategory(article: Article): ArticleCategory {
    if (!this.articleCategories) { return; }
    if (!article.category || !article.category._id) { return  this.articleCategories[0] ; } // default value
    return this.articleCategories.find(category => category._id === article.category._id);
  }

  /**
   * Returns the ArticleStatus entry in the articleStatus selection list for displaying the correct entry.
   */
  private getArticleStatus(article: Article): ArticleStatus {
    if (!this.articleStatus) { return; }
    if (!article.status || !article.status._id) { return  this.articleStatus[0] ; } // default value
    return this.articleStatus.find(status => status._id === article.status._id);
  }

  /**
   * Returns a new article object with formControl values.
   */
  private getArticleToSave(): Article {
    const articleToSave = Object.assign(new Article(), this.articleForm.value);

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

  // Handle pictures array
  // --------------------------------------------------------------------------
  private setPictures(pictures: string[]) {
    const pictureFCs = pictures.map(pictureUrl =>
      this.formBuilder.control(pictureUrl, Validators.required));
    this.articleForm.setControl('pictures', this.formBuilder.array(pictureFCs));
  }
  public onAddPicture() {
    this.pictures.push(this.formBuilder.control('', Validators.required));
  }
  public onDeletePicture(index: number) {
    this.pictures.removeAt(index);
  }

  // Handle videos array
  // --------------------------------------------------------------------------
  private setVideos(videos: string[]) {
    const videosFCs = videos.map(videoUrl =>
      this.formBuilder.control(videoUrl, Validators.required));
    this.articleForm.setControl('videos', this.formBuilder.array(videosFCs));
  }
  public onAddVideo() {
    this.videos.push(this.formBuilder.control('', Validators.required));
  }
  public onDeleteVideo(index: number) {
    this.videos.removeAt(index);
  }

  // User events.
  // --------------------------------------------------------------------------

  public onAddArticle() {
    this.editMode = EditModeType.Create;
    this.resetArticle();
    this.createForm();
  }

  public onSaveArticle() {
    if (this.editMode === EditModeType.Create) {
      this.createArticle();

    } else if (this.editMode === EditModeType.Update) {
      this.updateArticle();
    }
  }

  public onRevert() {
    this.updateForm();
  }

  public onGoBack(): void {
    this.location.back();
  }

  // CRUD operations.
  // --------------------------------------------------------------------------

  private createArticle() {
    const articleToSave = this.getArticleToSave();

    this.articleBackend.createArticle(articleToSave).subscribe(
      (savedArticle: Article) => {
        this.article = savedArticle;
        this.editMode = EditModeType.Update;
        this.updateForm();
        this.dialogService.inform('Artikel hinzufügen',
          'Der Artikel wurde erfolgreich hinzugefügt.');
      }
    );
  }

  private updateArticle() {
    const articleToSave = this.getArticleToSave();

    this.articleBackend.updateArticle(articleToSave).subscribe(
      (savedArticle: Article) => {
        this.article = savedArticle;
        this.updateForm();
        this.dialogService.inform('Artikel aktualisieren',
          'Der Artikel wurde erfolgreich aktualisiert.');
      }
    );
  }


}
