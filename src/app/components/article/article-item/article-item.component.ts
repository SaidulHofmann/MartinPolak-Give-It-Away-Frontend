// Creates a new article. UC3.1-Artikel erfassen.

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Article, ArticleCategory, ArticleStatus } from '../../../models/index.model';
import {DialogResultType, EditModeType} from '../../../core/enums.core';
import {DialogService} from '../../shared/services/dialog.service';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import { Observable } from 'rxjs';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleItemService} from '../services/article-item.service';
import {AuthService} from '../../permission/services/auth.service';

@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent implements OnInit, OnChanges, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables
  // ----------------------------------
  public EditModeType = EditModeType;
  public articleForm: FormGroup;


  // Properties
  // ----------------------------------
  public get articleCategories(): ArticleCategory[] { return this.articleItemSvc.articleCategories; }
  public get articleStatus(): ArticleStatus[]       { return this.articleItemSvc.articleStatus; }
  @Input()
  public set editMode(editMode: EditModeType)       { this.articleItemSvc.editMode = editMode; }
  public get editMode()                             { return this.articleItemSvc.editMode; }
  @Input()
  public set article(article: Article)              { this.articleItemSvc.article = article; }
  public get article()                              { return this.articleItemSvc.article; }

  // FormControl Getters
  public get name()                                 { return this.articleForm.get('name'); }
  public get description()                          { return this.articleForm.get('description'); }
  public get handover()                             { return this.articleForm.get('handover'); }
  public get pictureOverview()                      { return this.articleForm.get('pictureOverview'); }
  public get pictures(): FormArray                  { return this.articleForm.get('pictures') as FormArray; }
  public get videos(): FormArray                    { return this.articleForm.get('videos') as FormArray; }


  // Methods
  // ----------------------------------

  constructor(
    private articleItemSvc: ArticleItemService,
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    private dialogService: DialogService) {
  }

  public ngOnInit() {
    if (!this.article) {
      this.articleItemSvc.resetArticle();
    }
    this.createForm();
    Promise.resolve(this.initAsync());
  }

  private async initAsync(): Promise<void> {
    try {
      await this.articleItemSvc.loadSelectionListsAsync();
      this.updateForm();
    } catch (ex) {
      throw new Error('Fehler bei der Initialisierung der Komponente ArticleItem:  ' + ex.message);
    }
  }

  /**
   * Updates the article form on @Input() Property Change.
   */
  public ngOnChanges() {
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
   * Creates the article form for displaying and editing articles.
   */
  private createForm() {
    // Article
    this.articleForm =    this.formBuilder.group({
      _id:                this.article._id || null,
      category:           this.articleItemSvc.getArticleCategory(this.article),
      name:               [this.article.name || '', Validators.required ],
      description:        [this.article.description || '', Validators.required ],
      handover:           [this.article.handover || '', Validators.required ],

      pictureOverview:    this.article.pictureOverview || '',
      pictures:           this.formBuilder.array( []),
      videos:             this.formBuilder.array( []),
      tags:               this.article.tags || '',
      status:             this.articleItemSvc.getArticleStatus(this.article) || null,

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
    if (!this.article || !this.articleForm) { return; }

    this.articleForm.reset({
      _id:                this.article._id || null,
      category:           this.articleItemSvc.getArticleCategory(this.article),
      name:               this.article.name || '',
      description:        this.article.description || '',
      handover:           this.article.handover || '',

      pictureOverview:    this.article.pictureOverview || '',
      tags:               this.article.tags || '',
      status:             this.articleItemSvc.getArticleStatus(this.article),
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
    this.articleItemSvc.resetArticle();
    this.createForm();
  }

  public onSaveArticle() {
    if (this.editMode === EditModeType.Create) {
      this.articleItemSvc.createArticleAsync(this.articleForm.value).then(() => {
        this.updateForm();
        this.dialogService.inform('Artikel hinzufügen',
          'Der Artikel wurde erfolgreich hinzugefügt.');
      });

    } else if (this.editMode === EditModeType.Update) {
      this.articleItemSvc.updateArticleAsync(this.articleForm.value).then(() => {
        this.updateForm();
        this.dialogService.inform('Artikel aktualisieren',
          'Der Artikel wurde erfolgreich aktualisiert.');
      });
    }
  }

  public onRevert() {
    this.updateForm();
  }

  public onGoBack() {
    this.navService.goBack();
  }

}
