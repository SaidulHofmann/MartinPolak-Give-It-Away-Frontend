// Creates a new article. UC3.1-Artikel erfassen.

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';

import { Article, ArticleCategory, ArticleStatus, User, UserRef, EditModeEnum } from '../../../models/index.model';
import { articleCategories, articleStatus, testUserRef, defaultUserRef, testArticle } from '../../../models/data.model';
import {ArticleService} from '../../../services/article.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnChanges {

  // Constants, variables
  // ---------------------
  @Input() editMode: string = EditModeEnum.READ;
  @Input() article: Article;

  articleForm: FormGroup;
  articleCategories = articleCategories;
  articleStatus = articleStatus;

  // Properties
  // ---------------------
  get editModeEnum() { return EditModeEnum; } // Needed for template.

  // FormControl Getters
  get name() { return this.articleForm.get('name'); }
  get description() { return this.articleForm.get('description'); }
  get handover() { return this.articleForm.get('handover'); }
  get pictureOverview() { return this.articleForm.get('pictureOverview'); }
  get pictures(): FormArray { return this.articleForm.get('pictures') as FormArray; }
  get videos(): FormArray { return this.articleForm.get('videos') as FormArray; }


  // Methods
  // ------------------

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private userService: UserService,
    private location: Location) {

    if (!this.article) {
      this.createArticle();
    }
    this.createForm();
  }

  ngOnInit() {
  }

  /**
   * Updates the article form on @Input() Property Change.
   */
  ngOnChanges() {
    this.rebuildForm();
  }

  createArticle() {
    this.article = new Article();
    this.userService.getCurrentUser().subscribe(
      (user) => { this.article.publisher = user as UserRef; }
    );
  }

  /**
   * Creates the article form for displaying and editing articles.
   */
  createForm() {
    console.log('@ArticleComponent.createForm()');
    console.log('this.article: ', this.article);
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
      status:             this.getArticleStatus(this.article),

      // Give away
      donee:              this.formBuilder.group({
        _id:              this.article.donee ? this.article.donee._id : null,
        firstname:        this.article.donee ? this.article.donee.firstname : '',
        lastname:         this.article.donee ? this.article.donee.lastname : ''
      }),
      donationDate:       this.article.donationDate || null,

      // Publishing
      publisher:          this.formBuilder.group({
        _id:              [this.article.publisher ? this.article.publisher._id : null, Validators.required ],
        firstname:        this.article.publisher ? this.article.publisher.firstname : '',
        lastname:         this.article.publisher ? this.article.publisher.lastname : ''
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
  rebuildForm() {
    if (!this.article) { return; }

    console.log('@ArticleComponent.rebuildForm()');
    console.log('this.article: ', this.article);
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
        firstname:        this.article.donee ? this.article.donee.firstname : '',
        lastname:         this.article.donee ? this.article.donee.lastname : ''
      },
      donationDate:       this.article.donationDate || null,

      publisher:          {
        _id:              this.article.publisher ? this.article.publisher._id : null,
        firstname:        this.article.publisher ? this.article.publisher.firstname : '',
        lastname:         this.article.publisher ? this.article.publisher.lastname : ''
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
  getArticleCategory(article: Article): ArticleCategory {
    if (!article.category || !article.category._id) { return  this.articleCategories[0] ; } // default value
    return this.articleCategories.find(category => category._id === article.category._id);
  }

  /**
   * Returns the ArticleStatus entry in the articleStatus selection list for displaying the correct entry.
   */
  getArticleStatus(article: Article): ArticleStatus {
    if (!article.status || !article.status._id) { return  this.articleStatus[0] ; } // default value
    return this.articleStatus.find(status => status._id === article.status._id);
  }

  /**
   * Returns a new article object with formControl values.
   */
  prepareSaveArticle(): Article {
    console.log('@ArticleComponent.prepareSaveArticle()');

    const saveArticle = Object.assign(new Article(), this.articleForm.value);

    // Change view-model properties to model properties.
    if (saveArticle.publisher && !saveArticle.publisher._id) {
      saveArticle.publisher = null;
    }
    if (saveArticle.donee && !saveArticle.donee._id) {
      saveArticle.donee = null;
    }
    return saveArticle;
  }

  // Handle pictures array
  // --------------------------------------------------------------------------
  setPictures(pictures: string[]) {
    const pictureFCs = pictures.map(pictureUrl =>
      this.formBuilder.control(pictureUrl, Validators.required));
    this.articleForm.setControl('pictures', this.formBuilder.array(pictureFCs));
  }
  onAddPicture() {
    this.pictures.push(this.formBuilder.control('', Validators.required));
  }
  onDeletePicture(index: number) {
    this.pictures.removeAt(index);
  }

  // Handle videos array
  // --------------------------------------------------------------------------
  setVideos(videos: string[]) {
    const videosFCs = videos.map(videoUrl =>
      this.formBuilder.control(videoUrl, Validators.required));
    this.articleForm.setControl('videos', this.formBuilder.array(videosFCs));
  }
  onAddVideo() {
    this.videos.push(this.formBuilder.control('', Validators.required));
  }
  onDeleteVideo(index: number) {
    this.videos.removeAt(index);
  }


  onSubmit() {
    console.log('@ArticleComponent.onSubmit()');

    const articleToSave = this.prepareSaveArticle();

    if (this.editMode === EditModeEnum.CREATE) {
      this.articleService.createArticle(articleToSave).subscribe(
        (savedArticle: Article) => {
          this.article = savedArticle;
          this.editMode = EditModeEnum.UPDATE;
          this.rebuildForm();
        }
      );
    } else if (this.editMode === EditModeEnum.UPDATE) {
      this.articleService.updateArticle(articleToSave).subscribe(
        (savedArticle: Article) => {
          this.article = savedArticle;
          this.rebuildForm();
        }
      );
    }
  }

  onRevert() {
    this.rebuildForm();
  }

  onGoBack(): void {
    this.location.back();
  }


}
