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
import {DataService} from '../../shared/services/data.service';
import {imageUrlBackend} from '../../../core/globals.core';
import {ErrorDetails, FileUploadReport} from '../../../core/types.core';
import {getCustomOrDefaultError} from '../../../core/errors.core';



@Component({
  selector: 'app-article-item',
  templateUrl: './article-item.component.html',
  styleUrls: ['./article-item.component.scss']
})
export class ArticleItemComponent implements OnInit, OnChanges, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables
  // ----------------------------------
  public EditModeType = EditModeType;
  public imageUrl: string = imageUrlBackend;
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
  private get imageUrlBase()                        { return `${imageUrlBackend}/${this.article._id}`; }
  public set hoveredImage(image: string)            { this.articleItemSvc.hoveredImage = image; }
  public get hoveredImage()                         { return this.articleItemSvc.hoveredImage; }
  public set hoveredImageUrl(image: string)         { this.articleItemSvc.hoveredImageUrl = image; }
  public get hoveredImageUrl()                      { return this.articleItemSvc.hoveredImageUrl; }
  public get defaultImage()                         { return this.articleItemSvc.defaultImage; }
  public get defaultImageUrl()                      { return this.articleItemSvc.defaultImageUrl; }

  // FormControl Getters
  public get name()                                 { return this.articleForm.get('name'); }
  public get description()                          { return this.articleForm.get('description'); }
  public get handover()                             { return this.articleForm.get('handover'); }
  public get pictureOverviewControl()               { return this.articleForm.get('pictureOverview'); }
  public get picturesFormArray(): FormArray         { return this.articleForm.get('pictures') as FormArray; }
  public get videos(): FormArray                    { return this.articleForm.get('videos') as FormArray; }


  // Methods
  // ----------------------------------

  constructor(
    public authService: AuthService,
    private articleItemSvc: ArticleItemService,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    private dialogService: DialogService,
    private dataService: DataService) {
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
      this.onOverviewImageHover();
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

    this.createImageControls(this.article.pictures);
    this.createVideoControls(this.article.videos);
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
        fullname:         this.article.donee ? this.article.donee.fullname : ''
      },
      donationDate:       this.article.donationDate || null,

      publisher:          {
        _id:              this.article.publisher ? this.article.publisher._id : null,
        fullname:         this.article.publisher ? this.article.publisher.fullname : ''
      },
      createdAt:          this.article.createdAt || null,
      updatedAt:          this.article.updatedAt || null,
    });

    this.createImageControls(this.article.pictures);
    this.createVideoControls(this.article.videos);
  }

  // Handle Images.
  // --------------------------------------------------------------------------
  private createImageControls(images: string[]) {
    const imageFCs = images.map(imageFileName =>
      this.formBuilder.control(imageFileName, Validators.required));
    this.articleForm.setControl('pictures', this.formBuilder.array(imageFCs));
  }

  private addImageControl(imageFileName: string) {
    this.picturesFormArray.push(this.formBuilder.control(imageFileName, Validators.required));
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }
  }

  public onOverviewImageFileSelected(fileInput: HTMLInputElement) {
    let selectedFile: File = fileInput.files[0];
    if (!selectedFile) { return; }
    let currentOverviewImage = this.pictureOverviewControl.value;

    // Assign new image.
    this.pictureOverviewControl.setValue(selectedFile.name);
    this.articleItemSvc.imagesToUploadMap.set(selectedFile.name, selectedFile);
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }

    // Prepare to remove the old image.
    if (currentOverviewImage) {
      if (this.articleItemSvc.imagesToUploadMap.has(currentOverviewImage)) {
        this.articleItemSvc.imagesToUploadMap.delete(currentOverviewImage);
      } else if (!this.picturesFormArray.value.includes(currentOverviewImage)) {
        this.articleItemSvc.imagesToDeleteSet.add(currentOverviewImage);
      }
    }

    console.log('onAddOverviewImage: this.articleItemSvc.imagesToUploadMap: ', this.articleItemSvc.imagesToUploadMap);
    console.log('onAddOverviewImage: this.articleItemSvc.imagesToDeleteSet ', this.articleItemSvc.imagesToDeleteSet);
  }

  public onAdditionalImageFilesSelected(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) { return; }

    Array.from(fileInput.files).forEach(file => {
      if (!this.picturesFormArray.value.includes(file.name)) {
        this.articleItemSvc.imagesToUploadMap.set(file.name, file);
        this.addImageControl(file.name);
      }
    });

    console.log('onAdditionalImageFilesSelected: this.articleItemSvc.imagesToUploadMap: ', this.articleItemSvc.imagesToUploadMap);
  }

  public onDeleteOverviewImage() {
    let overviewImage = this.pictureOverviewControl.value;
    if (!overviewImage) { return; }

    this.pictureOverviewControl.setValue('');
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }
    if (this.picturesFormArray.value.includes(overviewImage)) { return; }

    if (this.articleItemSvc.imagesToUploadMap.has(overviewImage)) {
      this.articleItemSvc.imagesToUploadMap.delete(overviewImage);
    } else {
      this.articleItemSvc.imagesToDeleteSet.add(overviewImage);
    }
  }

  public onDeleteAdditionalImage(index: number) {
    let image = this.picturesFormArray.value[index];

    if (this.articleItemSvc.imagesToUploadMap.has(image)) {
      this.articleItemSvc.imagesToUploadMap.delete(image);
    } else if (this.pictureOverviewControl.value !== image) {
      this.articleItemSvc.imagesToDeleteSet.add(image);
    }
    this.picturesFormArray.removeAt(index);
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }

    console.log('onDeleteAdditionalImage: this.articleItemSvc.imagesToUploadMap: ', this.articleItemSvc.imagesToUploadMap);
    console.log('onDeleteAdditionalImage: this.articleItemSvc.imagesToDeleteSet ', this.articleItemSvc.imagesToDeleteSet);
  }

  public onOverviewImageHover() {
    this.hoveredImage = this.pictureOverviewControl.value;
    if (this.hoveredImage) {
      this.hoveredImageUrl = `${this.imageUrlBase}/${this.hoveredImage}`;
    } else {
      this.hoveredImageUrl = '';
    }
  }

  public onAdditionalImageHover(index: number) {
    this.hoveredImage = this.picturesFormArray.value[index];
    if (this.hoveredImage) {
      this.hoveredImageUrl = `${this.imageUrlBase}/${this.hoveredImage}`;
    } else {
      this.hoveredImageUrl = '';
    }
  }

  private setHoveredImageDefaultValue() {
    this.hoveredImage = this.defaultImage;
    this.hoveredImageUrl = this.defaultImageUrl;
  }

  public onImageError() {
    if (!this.hoveredImage) {
      this.setHoveredImageDefaultValue();
      return;
    }
    let imageFileToUpload: File = this.articleItemSvc.imagesToUploadMap.get(this.hoveredImage);
    if (imageFileToUpload) {
      this.setHoveredImageUrlForFile(imageFileToUpload);
    }
  }

  private setHoveredImageUrlForFile(file: File) {
    if (!file) { return; }

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.hoveredImageUrl = reader.result;
    };
    reader.onerror = (event) => {
      this.setHoveredImageDefaultValue();
    };
  }


  // Handle videos array
  // --------------------------------------------------------------------------
  private createVideoControls(videos: string[]) {
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
    console.log('@onSaveArticle()');

    if (this.editMode === EditModeType.Create) {
      this.createArticleAsync();

    } else if (this.editMode === EditModeType.Update) {
      this.updateArticleAsync();
    }
  }

  public onRevert() {
    this.articleItemSvc.imagesToUploadMap.clear();
    this.articleItemSvc.imagesToDeleteSet.clear();
    this.updateForm();
  }

  public onGoBack() {
    this.navService.goBack();
  }

  private async createArticleAsync(): Promise<void> {
    // Create article.
    let message: string = '';
    try {
      await this.articleItemSvc.createArticleAsync(this.articleForm.value);
      this.updateForm();
      message = `Der Artikel wurde erfolgreich hinzugefügt.
      `;

      // Upload images. Article id is needed for uploading images.
      if (this.articleItemSvc.hasFilesToUpload) {
        let uploadReport = await this.articleItemSvc.uploadImages();
        if (uploadReport.hasFailedEntries) {
          await this.removeInvalidFileEntriesAsync(uploadReport);
          await this.articleItemSvc.updateArticleAsync(this.articleForm.value);
          this.updateForm();
        }
        message += uploadReport.getReport();
      }

      this.dialogService.inform('Artikel hinzufügen', message);

    } catch (ex) {
      this.dialogService.inform('Artikel hinzufügen', message + 'Beim Hinzufügen des Artikels ist ein Fehler aufgetreten: ' + ex.message);
      return;
    }
  }

  private async updateArticleAsync(): Promise<void> {
    console.log('@updateArticleAsync()');

    let message: string = '';
    try {
      // Delete images selected for deletion.
      let deleteReport = null;
      if (this.articleItemSvc.hasFilesToDelete) {
        deleteReport = await this.articleItemSvc.deleteImages();
      }
      // Upload images.
      let uploadReport = null;
      if (this.articleItemSvc.hasFilesToUpload) {
        uploadReport = await this.articleItemSvc.uploadImages();
        if (uploadReport.hasFailedEntries) {
          await this.removeInvalidFileEntriesAsync(uploadReport);
        }
      }
      // Update article.
      await this.articleItemSvc.updateArticleAsync(this.articleForm.value);
      this.updateForm();
      message = `Der Artikel wurde erfolgreich aktualisiert.
        `;
      if (uploadReport) { message += uploadReport.getReport(); }
      if (deleteReport) { message += deleteReport.getReport(); }
      this.dialogService.inform('Artikel aktualisieren', message);
    } catch (ex) {
        this.dialogService.inform('Artikel aktualisieren', 'Beim Aktualisieren des Artikels ist ein Fehler aufgetreten: ' + ex.message);
        return;
      }
  }

  /**
   * Remove Image file entries that were planned to upload, but couldn't be uploaded.
   */
  private async removeInvalidFileEntriesAsync(uploadReport: FileUploadReport): Promise<void> {
    console.log('@removeInvalidFileEntriesAsync()');

    // Check and remove overview image.
    let overviewImageName = this.pictureOverviewControl.value;
    if (overviewImageName) {
      let overviewImageStatus = uploadReport.fileStatusMap.get(overviewImageName);
      if (overviewImageStatus && !overviewImageStatus.processedSuccessfully) {
        if (this.article.pictureOverview && this.article.pictureOverview !== overviewImageName) {
          this.pictureOverviewControl.setValue(this.article.pictureOverview); // Reset to original value.
        } else {
          this.pictureOverviewControl.setValue('');
        }
      }
    }

    // Check and remove additional images.
    for (let [fileName, fileStatus] of uploadReport.fileStatusMap) {
      if (!fileStatus.processedSuccessfully) {
        let index = this.picturesFormArray.value.indexOf(fileName);
        if (index > -1) {
          this.picturesFormArray.removeAt(index);
        }
     }
    }
  }

}
