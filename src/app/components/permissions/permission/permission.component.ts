import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogResultType, EditModeType, ErrorCodeType} from '../../../core/enums.core';
import {User} from '../../../models/user.model';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {UserService} from '../../../services/user.service';
import {DialogService} from '../../../services/dialog.service';
import {NgForm} from '@angular/forms';
import {Permission, PermissionRef} from '../../../models/permission.model';
import {LocalDataService} from '../../../services/local-data.service';
import {Article, ArticleCategory} from '../../../models/index.model';
import {ErrorDetails} from '../../../core/types.core';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  // Constants, variables and properties.
  // --------------------------------------------------------------------------
  public EditModeType = EditModeType;
  public editMode: EditModeType = EditModeType.Read;


  @ViewChild('permissionForm') private permissionForm: NgForm;
  @ViewChild('name', { read: ElementRef }) private nameInput: ElementRef;

  private _editingPermission: Permission = new Permission();
  public set editingPermission(permission: Permission) {
    this._editingPermission = permission;
  }
  public get editingPermission() { return this._editingPermission; }

  private _selectedPermission = new Permission();
  @Input()
  public set selectedPermission(permission: Permission) {
    this._selectedPermission = permission;
    this.editingPermission = Object.assign({}, permission);
    this.editMode = EditModeType.Read;
  }
  public get selectedPermission() { return this._selectedPermission; }

  @Output()
  public dataChanged = new EventEmitter<void>();


  // Methods.
  // --------------------------------------------------------------------------

  constructor(
    public userService: UserService,
    private dialogService: DialogService,
    private localDataService: LocalDataService) {
  }

  public ngOnInit() {
  }

  private onDataChanged() {
    this.dataChanged.emit();
  }

  // User events.
  // --------------------------------------------------------------------------

  public onEditPermission() {
    this.editMode = this.EditModeType.Update;
    this.nameInput.nativeElement.focus();
  }

  public onAddPermission() {
    this.editMode = EditModeType.Create;
    this._editingPermission = new Permission();
    this.nameInput.nativeElement.focus();
  }

  public onDeletePermission() {
    this.editMode = EditModeType.Delete;
    this.deletePermission();
  }

  public onSavePermission() {
    if (this.editMode === EditModeType.Create) {
      this.createPermission();

    } else if (this.editMode === EditModeType.Update) {
      this.updatePermission();
    }
  }

  public onCancelEdit() {
    this._editingPermission = Object.assign({}, this.selectedPermission);
    this.permissionForm.form.markAsPristine();
    this.editMode = this.EditModeType.Read;
  }


  // CRUD operations.
  // --------------------------------------------------------------------------

  private preparePermissionToSave() {
    this._editingPermission.name = this._editingPermission.name.trim();
  }

  private createPermission() {
    this.preparePermissionToSave();
    this.userService.createPermission(this._editingPermission).subscribe(
      (savedPermission: Permission) => {
        this._editingPermission = savedPermission;
        this.editMode = this.EditModeType.Update;
        this.onDataChanged();
        this.dialogService.inform('Berechtigungs-Eintrag erstellen',
          'Der Berechtigungs-Eintrag wurde erfolgreich erstellt.');
      },
      (errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Berechtigungs-Eintrag erstellen',
            errorDetails.message || 'Die Berechtigungs-Bezeichnung wird bereits verwendet.');
          this._editingPermission.name = '';
        } else {
          this.dialogService.inform('Berechtigungs-Eintrag erstellen',
            errorDetails.message || 'Bei der Erstellung des Berechtigungs-Eintrags ist ein Fehler aufgetreten.');
        }
      }
    );
  }

  private updatePermission() {
    this.preparePermissionToSave();
    this.userService.updatePermission(this._editingPermission).subscribe(
      (savedPermission: Permission) => {
        this._editingPermission = savedPermission;
        this.onDataChanged();
        this.dialogService.inform('Berechtigungs-Eintrag aktualisieren',
          'Der Berechtigungs-Eintrag wurde erfolgreich aktualisiert.');
      },
      (errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Berechtigungs-Eintrag aktualisieren',
            errorDetails.message || 'Die Berechtigungs-Bezeichnung wird bereits verwendet.');
          this._editingPermission.name = '';
        } else {
          this.dialogService.inform('Berechtigungs-Eintrag aktualisieren',
            errorDetails.message || 'Bei der Aktualisierung des Berechtigungs-Eintrags ist ein Fehler aufgetreten.');
        }
      }
    );
  }

  private deletePermission() {
    let permissionName = this._editingPermission.name;
    this.dialogService.askForDelete('Berechtigungs-Eintrag entfernen',
      `Soll der Berechtigungs-Eintrag '${permissionName}' wirklich entfernt werden ?`)
      .subscribe((dialogResult: DialogResultType) => {

        if (dialogResult === DialogResultType.Delete) {
          this.userService.deletePermission(this.selectedPermission).subscribe(
            (permission: Permission) => {
              this.onDataChanged();
              this._editingPermission = new Permission();
              this.permissionForm.form.markAsPristine();
              this.editMode = this.EditModeType.Read;
              this.dialogService.inform('Berechtigungs-Eintrag entfernen',
                `Der Berechtigungs-Eintrag '${permissionName}' wurde erfolgreich entfernt.`);
            },
            (errorResponse) => {
              let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
              this.dialogService.inform('Berechtigungs-Eintrag entfernen',
                errorDetails.message || 'Beim Entfernen des Berechtigungs-Eintrags ist ein Fehler aufgetreten.');
            });

        } else if (dialogResult === DialogResultType.Cancel) {
          this.editMode = this.EditModeType.Read;
        }
      });
    this.editMode = this.EditModeType.Read;
  }

}
