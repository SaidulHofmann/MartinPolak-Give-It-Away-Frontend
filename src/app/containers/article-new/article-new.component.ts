// Creates a new article. UC3.1-Artikel erfassen.

import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { Article } from '../../models/article.model';
import { articleCategories, articleStatus, testUserRef, testArticle } from '../../models/enum.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';
import {ArticleService} from '../../services/article.service';
import {UserRef} from '../../models/user.model';
import {ArticleCategory} from '../../models/articleCategory.model';
import {ArticleStatus} from '../../models/articleStatus.model';
import {Location} from '@angular/common';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.scss']
})
export class ArticleNewComponent implements OnInit, OnChanges {
  // @Input() article: Article;
  article: Article = testArticle;

  articleCategories = articleCategories;
  articleStatus = articleStatus;
  articleForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private location: Location) {

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

  createForm() {
    // Article
    this.articleForm =    this.formBuilder.group({
      category:           this.article.category || articleCategories[0],
      name:               [this.article.name || '', Validators.required ],
      description:        [this.article.description || '', Validators.required ],
      handover:           [this.article.handover || '', Validators.required ],
      pictureOverview:    this.article.pictureOverview || '',
      pictures:           this.formBuilder.array( []),
      videos:             this.formBuilder.array( []),
      tags:               this.article.tags || '',
      status:             this.article.status || articleStatus[0],

      // Give away
      donationDate:       this.article.donationDate || null,
      donee:              this.formBuilder.group({
        _id:              this.article.donee._id || '',
        firstname:        this.article.donee.firstname || '',
        lastname:         this.article.donee.lastname || ''
      }),

      // Publisher
      publisher:          this.formBuilder.group({
        _id:              this.article.publisher._id || '',
        firstname:        this.article.publisher.firstname || '',
        lastname:         this.article.publisher.lastname || ''
      }),
      createdAt: this.article.createdAt || null,
      updatedAt: this.article.updatedAt || null,
      _id: this.article._id || ''

    });
  }

  // FormControl Getters
  get name() { return this.articleForm.get('name'); }
  get description() { return this.articleForm.get('description'); }
  get handover() { return this.articleForm.get('handover'); }
  get pictureOverview() { return this.articleForm.get('pictureOverview'); }
  get pictures(): FormArray { return this.articleForm.get('pictures') as FormArray; }
  get videos(): FormArray { return this.articleForm.get('videos') as FormArray; }
  get tags() { return this.articleForm.get('tags'); }
  get donationDate() { return this.articleForm.get('donationDate'); }

  rebuildForm() {
    this.articleForm.reset({
      name:               this.article.name || '',
      description:        this.article.description || '',
      handover:           this.article.handover || '',
      pictureOverview:    this.article.pictureOverview || '',
      tags:               this.article.tags || '',
      donationDate:       this.article.donationDate || null,

      publisher:          this.article.publisher || null,
      donee:              this.article.donee || null,
      category:           this.article.category || articleCategories[0],
      status:             this.article.status || articleStatus[0],

      createdAt:          this.article.createdAt || null,
      updatedAt:          this.article.updatedAt || null,
      _id:                this.article._id || ''
    });

    this.setPictures(this.article.pictures);
    this.setVideos(this.article.videos);
  }

  prepareSaveArticle(): Article {
    const formModel = this.articleForm.value;

    // Create copies of the pictures array items to prevent changing this.article values by entry form.
    const picturesArray: string[] = formModel.pictures.map(
      (picture) => (picture as string)
    );

    const saveArticle = new Article();
    saveArticle._id =             this.article._id;
    saveArticle.name =            formModel.name as string;
    saveArticle.description =     formModel.description as string;
    saveArticle.handover =        formModel.handover as string;
    saveArticle.pictureOverview = formModel.pictureOverview as string;
    saveArticle.pictures =        picturesArray;
    saveArticle.tags =            formModel.tags as string;
    saveArticle.donationDate =    formModel.donationDate as Date;

    saveArticle.publisher =       (formModel.publisher as UserRef);
    saveArticle.donee =           (formModel.donee as UserRef);
    saveArticle.category =        (formModel.category as ArticleCategory);
    saveArticle.status =          (formModel.status as ArticleStatus);

    saveArticle.createdAt =        this.article.createdAt || null,
    saveArticle.updatedAt =        this.article.updatedAt || null,
    saveArticle._id =              this.article._id || ''

    console.log('@ArticleNewComponent.saveArticle()', saveArticle);

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

    // Remove from db (service).
  }
  onDeletePicture(index: number) {
    // Remove from local article pictures array.
    this.pictures.removeAt(index);

    // Remove from db (service).
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

    // Remove from db (service).
  }
  onDeleteVideo(index: number) {
    // Remove from local article videos array.
    this.videos.removeAt(index);

    // Remove from db (service).
  }


  onSubmit() {
    this.article = this.prepareSaveArticle();
    console.log('@ArticleNewComponent.onSubmit()');

    // Test creatArticle
    this.article._id = null;
    this.articleService.createArticle(this.article).subscribe(
      (article: Article) => {
        this.article = article;
        this.rebuildForm();
      }
    );

    // this.articleService.updateArticle(this.article).subscribe();


  }

  onRevert() {
    this.rebuildForm();
  }

  onCancel(): void {
    this.location.back();
  }


}
