import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogResultType, EditModeType, ErrorCodeType} from '../../../core/enums.core';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {DialogService} from '../../shared/services/dialog.service';
import {NgForm} from '@angular/forms';
import {Permission} from '../../../models/permission.model';
import {ErrorDetails} from '../../../core/types.core';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../services/can-deactivate-guard.service';
import {Observable} from 'rxjs/index';
import {PermissionItemService} from '../services/permission-item.service';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-permission-item',
  templateUrl: './permission-item.component.html',
  styleUrls: ['./permission-item.component.scss']
})
export class PermissionItemComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables and properties.
  // --------------------------------------------------------------------------
  public EditModeType = EditModeType;

  public set editMode(editMode: EditModeType) {
    this.permissionItemSvc.editMode = editMode;
  }
  public get editMode() { return this.permissionItemSvc.editMode; }

  @ViewChild('permissionForm') private permissionForm: NgForm;
  @ViewChild('name', { read: ElementRef }) private nameInput: ElementRef;

  public set editingPermission(permission: Permission) {
    this.permissionItemSvc.editingPermission = permission;
  }
  public get editingPermission() { return this.permissionItemSvc.editingPermission; }

  @Input()
  public set selectedPermission(permission: Permission) {
    this.permissionItemSvc.selectedPermission = permission;
  }
  public get selectedPermission() { return this.permissionItemSvc.selectedPermission; }

  @Output()
  public get dataChanged() { return this.permissionItemSvc.dataChanged; }


  // Methods.
  // --------------------------------------------------------------------------

  constructor(
    public authService: AuthService,
    public permissionItemSvc: PermissionItemService,
    private dialogService: DialogService) {
  }

  public ngOnInit() {
  }

  private onDataChanged() {
    this.permissionItemSvc.onDataChanged();
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.permissionForm.dirty) { return true; }

    return new Promise((resolve, reject) => {
      this.dialogService.askForLeavePageWithUnsavedChanges().subscribe(dialogResult => {
        resolve(dialogResult === DialogResultType.Yes);
      });
    });
  }

  // User events.
  // --------------------------------------------------------------------------

  public onEditPermission() {
    this.permissionItemSvc.editPermission();
    this.nameInput.nativeElement.focus();
  }

  public onAddPermission() {
    this.permissionItemSvc.addPermission();
    this.nameInput.nativeElement.focus();
  }

  public onDeletePermission() {
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
    this.permissionItemSvc.cancelEdit();
    this.permissionForm.form.markAsPristine();
  }

  private createPermission() {
    this.permissionItemSvc.createPermissionAsync()
      .then((savedPermission: Permission) => {
        this.permissionForm.form.markAsPristine();
        this.dialogService.inform('Berechtigungs-Eintrag erstellen',
          'Der Berechtigungs-Eintrag wurde erfolgreich erstellt.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Berechtigungs-Eintrag erstellen',
            errorDetails.message || 'Die Berechtigungs-Bezeichnung wird bereits verwendet.');
          this.editingPermission.name = '';
        } else {
          this.dialogService.inform('Berechtigungs-Eintrag erstellen',
            'Bei der Erstellung des Berechtigungs-Eintrags ist ein Fehler aufgetreten: ' + errorDetails.message);
        }
      });
  }

  private updatePermission() {
    this.permissionItemSvc.updatePermissionAsync()
      .then((savedPermission: Permission) => {
        this.permissionForm.form.markAsPristine();
        this.dialogService.inform('Berechtigungs-Eintrag aktualisieren',
          'Der Berechtigungs-Eintrag wurde erfolgreich aktualisiert.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Berechtigungs-Eintrag aktualisieren',
            errorDetails.message || 'Die Berechtigungs-Bezeichnung wird bereits verwendet.');
          this.editingPermission.name = '';
        } else {
          this.dialogService.inform('Berechtigungs-Eintrag aktualisieren',
            'Bei der Aktualisierung des Berechtigungs-Eintrags ist ein Fehler aufgetreten: ' + errorDetails.message);
        }
      });
  }

  private deletePermission() {
    let permissionName = this.editingPermission.name;
    let dialogResultObs = this.dialogService.askForDelete('Berechtigungs-Eintrag entfernen',
      `Soll der Berechtigungs-Eintrag '${permissionName}' wirklich entfernt werden ?`);

    dialogResultObs.subscribe((dialogResult: DialogResultType) => {
      if (dialogResult !== DialogResultType.Delete) { return; }
      this.permissionItemSvc.deletePermissionAsync()
        .then(() => {
          this.permissionForm.form.markAsPristine();
          this.dialogService.inform('Berechtigungs-Eintrag entfernen',
            `Der Berechtigungs-Eintrag '${permissionName}' wurde erfolgreich entfernt.`);
        })
        .catch((errorResponse) => {
          let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
          this.dialogService.inform('Berechtigungs-Eintrag entfernen',
            'Beim Entfernen des Berechtigungs-Eintrags ist ein Fehler aufgetreten: ' + errorDetails.message);
        });
    });
  }

}
