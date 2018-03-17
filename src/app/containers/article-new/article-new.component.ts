// Creates a new article. UC3.1-Artikel erfassen.

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';

import { Article, ArticleCategory, ArticleStatus, User, UserRef, EditModeEnum } from '../../models/index.model';
import { articleCategories, articleStatus, testUserRef, defaultUserRef, testArticle } from '../../models/data.model';
import {ArticleService} from '../../services/article.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.scss']
})
export class ArticleNewComponent implements OnInit, OnChanges {
  @Input() editMode: string = EditModeEnum.CREATE;
  get editModeEnum(){ return EditModeEnum; }
  @Input() article: Article;
  // article: Article = testArticle;

  articleCategories = articleCategories;
  articleStatus = articleStatus;
  articleForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private userService: UserService,
    private location: Location) {

    if (!this.article) {
      this.createArticle();
    }
    this.createForm();
    this.rebuildForm();
  }

  ngOnInit() {
  }

  /**
   * Updates the article on @Input() Property Change.
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
   * Creates the article form for creating or updating articles.
   */
  createForm() {
    console.log('@ArticleNewComponent.createForm()');
    // Article
    this.articleForm =    this.formBuilder.group({
      _id:                this.article._id || null,
      category:           this.getArticleCategory(this.article.category._id),
      name:               [this.article.name || '', Validators.required ],
      description:        [this.article.description || '', Validators.required ],
      handover:           [this.article.handover || '', Validators.required ],

      pictureOverview:    this.article.pictureOverview || '',
      pictures:           this.formBuilder.array( []),
      videos:             this.formBuilder.array( []),
      tags:               this.article.tags || '',
      status:             this.getArticleStatus(this.article.status._id),

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
  }

  // FormControl Getters
  get name() { return this.articleForm.get('name'); }
  get description() { return this.articleForm.get('description'); }
  get handover() { return this.articleForm.get('handover'); }
  get pictureOverview() { return this.articleForm.get('pictureOverview'); }
  get pictures(): FormArray { return this.articleForm.get('pictures') as FormArray; }
  get videos(): FormArray { return this.articleForm.get('videos') as FormArray; }

  /**
   * Sets the article values to the form controls.
   */
  rebuildForm() {
    console.log('@ArticleNewComponent.rebuildForm()');
    this.articleForm.reset({
      _id:                this.article._id || null,
      category:           this.getArticleCategory(this.article.category._id),
      name:               this.article.name || '',
      description:        this.article.description || '',
      handover:           this.article.handover || '',

      pictureOverview:    this.article.pictureOverview || '',
      tags:               this.article.tags || '',
      status:             this.getArticleStatus(this.article.status._id),
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

  getArticleCategory(_id: string): ArticleCategory {
    if (!_id) { return  articleCategories[0] ; } // default value
    return this.articleCategories.find(category => category._id === _id);
  }

  getArticleStatus(_id: string): ArticleStatus {
    if (!_id) { return  articleStatus[0] ; } // default value
    return this.articleStatus.find(status => status._id === _id);
  }

  /**
   * Sets the formControl values to a new article object.
   * @returns {Article}
   */
  prepareSaveArticle(): Article {
    console.log('@ArticleNewComponent.prepareSaveArticle()');
    const formModel = this.articleForm.value;

    // Create copies of the pictures / videos array items to prevent changing the original values of this.article by entry form.
    const picturesArray: string[] = formModel.pictures.map(
      (picture) => (picture as string)
    );
    const videosArray: string[] = formModel.videos.map(
      (video) => (video as string)
    );

    const saveArticle = new Article();
    saveArticle._id =             this.article._id || null;
    saveArticle.category =        (formModel.category as ArticleCategory);
    saveArticle.name =            formModel.name as string;
    saveArticle.description =     formModel.description as string;
    saveArticle.handover =        formModel.handover as string;

    saveArticle.pictureOverview = formModel.pictureOverview as string;
    saveArticle.pictures =        picturesArray;
    saveArticle.videos =          videosArray;
    saveArticle.tags =            formModel.tags as string;
    saveArticle.status =          (formModel.status as ArticleStatus);

    saveArticle.donee =           this.article.donee,
    saveArticle.donationDate =    formModel.donationDate as Date;

    saveArticle.publisher =       this.article.publisher;
    saveArticle.createdAt =       this.article.createdAt || null,
    saveArticle.updatedAt =       null;

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
    console.log('@ArticleNewComponent.onSubmit()');

    let articleToSave = this.prepareSaveArticle();

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

  onCancel(): void {
    this.location.back();
  }


}
