// Creates a new article. UC3.1-Artikel erfassen.

import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Article, ArticleCategory, ArticleStatus} from '../../../models/index.model';
import {DialogResultType, EditModeType} from '../../../core/enums.core';
import {DialogService} from '../../shared/services/dialog.service';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import {Observable} from 'rxjs';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleItemService} from '../services/article-item.service';
import {AuthService} from '../../permission/services/auth.service';
import {DataService} from '../../shared/services/data.service';
import {imageUrlBackend, maxImageFileSize} from '../../../core/globals.core';
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
  public set editMode(editMode: EditModeType) {
    this.articleItemSvc.editMode = editMode;
    this.setFocus();
    this.setReadOnly();
  }
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
  public get isArticleFormDisabled()                { return this.articleForm ? this.articleForm.disabled : true; }
  // FormControl Getters
  public get name()                                 { return this.articleForm.get('name'); }
  public get description()                          { return this.articleForm.get('description'); }
  public get handover()                             { return this.articleForm.get('handover'); }
  public get overviewImageControl()                 { return this.articleForm.get('overviewImage'); }
  public get additionalImagesFormArray(): FormArray   { return this.articleForm.get('additionalImages') as FormArray; }

  @ViewChild('articleNameInput') private articleNameInput: ElementRef;

  // Methods
  // ----------------------------------

  constructor(
    public authService: AuthService,
    public articleItemSvc: ArticleItemService,
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

      overviewImage:      this.article.overviewImage || '',
      additionalImages:   this.formBuilder.array( []),
      tags:               this.article.tags || '',
      status:             [{ value: this.articleItemSvc.getArticleStatus(this.article) || null, disabled: true }],

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

    this.createImageControls(this.article.additionalImages);
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

      overviewImage:      this.article.overviewImage || '',
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

    this.createImageControls(this.article.additionalImages);
  }

  private setFocus(): void {
    if (this.articleItemSvc.editMode === EditModeType.Create || this.articleItemSvc.editMode === EditModeType.Update) {
      this.articleNameInput.nativeElement.focus();
    }
  }

  private setReadOnly(): void {
    if (!this.articleForm) { return; }
    if (this.isEditableArticle) {
      this.articleForm.enable();
    } else {
      this.articleForm.disable();
    }
  }

  public get isEditableArticle(): boolean {
    if (!this.articleForm) { return false; }
    switch (this.editMode) {
      case EditModeType.Read:
        return false;
      case EditModeType.Create:
        return this.authService.canCreateOwnArticle ? true : false;
      case EditModeType.Update:
        return this.authService.canUpdateArticle(this.article) ? true : false;
      case EditModeType.Delete:
        return false;
    }
  }


  // Handle Images.
  // --------------------------------------------------------------------------
  private createImageControls(images: string[]) {
    const imageFCs = images.map(imageFileName =>
      this.formBuilder.control(imageFileName, Validators.required));
    this.articleForm.setControl('additionalImages', this.formBuilder.array(imageFCs));
  }

  private addImageControl(imageFileName: string) {
    this.additionalImagesFormArray.push(this.formBuilder.control(imageFileName, Validators.required));
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }
  }

  public onOverviewImageFileSelected(fileInput: HTMLInputElement) {
    let selectedFile: File = fileInput.files[0];
    if (!selectedFile) { return; }
    if (selectedFile.size > maxImageFileSize) {
      this.dialogService.inform('Upload',
        `Die Datei '${selectedFile.name}' ist zu gross für den Upload. `
        + `Die maximale Grösse beträgt ${maxImageFileSize / (1024 * 1024)} MB.`);
      return;
    }
    let currentOverviewImage = this.overviewImageControl.value;

    // Assign new image.
    this.overviewImageControl.setValue(selectedFile.name);
    this.articleItemSvc.imagesToUploadMap.set(selectedFile.name, selectedFile);
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }

    // Prepare to remove the old image.
    if (currentOverviewImage) {
      if (this.articleItemSvc.imagesToUploadMap.has(currentOverviewImage)) {
        this.articleItemSvc.imagesToUploadMap.delete(currentOverviewImage);
      } else if (!this.additionalImagesFormArray.value.includes(currentOverviewImage)) {
        this.articleItemSvc.imagesToDeleteSet.add(currentOverviewImage);
      }
    }
  }

  public onAdditionalImageFilesSelected(fileInput: HTMLInputElement) {
    if (!fileInput.files || fileInput.files.length === 0) { return; }

    Array.from(fileInput.files).forEach(file => {
      if (!this.additionalImagesFormArray.value.includes(file.name)) {
        this.articleItemSvc.imagesToUploadMap.set(file.name, file);
        this.addImageControl(file.name);
      }
    });
  }

  public onDeleteOverviewImage() {
    let overviewImage = this.overviewImageControl.value;
    if (!overviewImage) { return; }

    this.overviewImageControl.setValue('');
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }
    if (this.additionalImagesFormArray.value.includes(overviewImage)) { return; }

    if (this.articleItemSvc.imagesToUploadMap.has(overviewImage)) {
      this.articleItemSvc.imagesToUploadMap.delete(overviewImage);
    } else {
      this.articleItemSvc.imagesToDeleteSet.add(overviewImage);
    }
  }

  public onDeleteAdditionalImage(index: number) {
    let image = this.additionalImagesFormArray.value[index];

    if (this.articleItemSvc.imagesToUploadMap.has(image)) {
      this.articleItemSvc.imagesToUploadMap.delete(image);
    } else if (this.overviewImageControl.value !== image) {
      this.articleItemSvc.imagesToDeleteSet.add(image);
    }
    this.additionalImagesFormArray.removeAt(index);
    if (this.articleForm.pristine) { this.articleForm.markAsDirty(); }
  }

  public onOverviewImageHover() {
    this.hoveredImage = this.overviewImageControl.value;
    if (this.hoveredImage) {
      this.hoveredImageUrl = `${this.imageUrlBase}/${this.hoveredImage}`;
    } else {
      this.hoveredImageUrl = '';
    }
  }

  public onAdditionalImageHover(index: number) {
    this.hoveredImage = this.additionalImagesFormArray.value[index];
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

  public onImageLoadError() {
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


  // User events.
  // --------------------------------------------------------------------------

  public onAddArticle() {
    this.editMode = EditModeType.Create;
    this.articleItemSvc.resetArticle();
    this.navService.gotoArticleCreatePage();
  }

  public onDeleteArticle() {
    this.deleteArticle();
  }

  public onSaveArticle() {
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
      await this.articleItemSvc.createArticleAsync(this.articleForm.getRawValue());
      this.updateForm();
      message = `Der Artikel wurde erfolgreich hinzugefügt.
      `;

      // Upload images. Article id is needed for uploading images.
      if (this.articleItemSvc.hasFilesToUpload) {
        let uploadReport = await this.articleItemSvc.uploadImages();
        if (uploadReport.hasFailedEntries) {
          await this.removeInvalidFileEntriesAsync(uploadReport);
          await this.articleItemSvc.updateArticleAsync(this.articleForm.getRawValue());
          this.updateForm();
        }
        message += uploadReport.getReport();
      }

      this.dialogService.inform('Artikel hinzufügen', message);
      this.navService.gotoArticleEditPage(this.article._id, true);

    } catch (ex) {
      this.dialogService.inform('Artikel hinzufügen', message + 'Beim Hinzufügen des Artikels ist ein Fehler aufgetreten: ' + ex.message);
      return;
    }
  }

  private async updateArticleAsync(): Promise<void> {
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
      await this.articleItemSvc.updateArticleAsync(this.articleForm.getRawValue());
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

  private deleteArticle() {
    let articleName = this.article.name;
    let dialogResultObs = this.dialogService.askForDelete('Artikel entfernen',
      `Soll der Artikel '${articleName}' wirklich entfernt werden ?`);

    dialogResultObs.subscribe((dialogResult: DialogResultType) => {
      if (dialogResult !== DialogResultType.Delete) { return; }
      this.articleItemSvc.deleteArticleAsync()
        .then(() => {
          this.updateForm();
          this.dialogService.inform('Artikel entfernen',
            `Der Artikel '${articleName}' wurde erfolgreich entfernt.`).subscribe( () => this.navService.goBack());
        })
        .catch((errorResponse) => {
          let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
          this.dialogService.inform('Artikel entfernen',
            'Beim Entfernen des Artikels ist ein Fehler aufgetreten: ' + errorDetails.message);
        });
    });
  }

  /**
   * Remove Image file entries that were planned to upload, but couldn't be uploaded.
   */
  private async removeInvalidFileEntriesAsync(uploadReport: FileUploadReport): Promise<void> {
    // Check and remove overview image.
    let overviewImageName = this.overviewImageControl.value;
    if (overviewImageName) {
      let overviewImageStatus = uploadReport.fileStatusMap.get(overviewImageName);
      if (overviewImageStatus && !overviewImageStatus.processedSuccessfully) {
        if (this.article.overviewImage && this.article.overviewImage !== overviewImageName) {
          this.overviewImageControl.setValue(this.article.overviewImage); // Reset to original value.
        } else {
          this.overviewImageControl.setValue('');
        }
      }
    }

    // Check and remove additional images.
    for (let [fileName, fileStatus] of uploadReport.fileStatusMap) {
      if (!fileStatus.processedSuccessfully) {
        let index = this.additionalImagesFormArray.value.indexOf(fileName);
        if (index > -1) {
          this.additionalImagesFormArray.removeAt(index);
        }
     }
    }
  }

  /**
   * Returns invalid controls for debugging purposes.
   */
  public getInvalidControls() {
    let invalidControls = [];
    for (const controlName in this.articleForm.controls) {
      if (this.articleForm.controls[controlName].invalid) {
        invalidControls.push(controlName);
      }
    }
    return invalidControls;
  }
}
