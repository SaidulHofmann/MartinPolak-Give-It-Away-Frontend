import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogResultType, EditModeType, ErrorCodeType} from '../../../core/enums.core';
import {User} from '../../../models/user.model';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {DialogService} from '../../shared/services/dialog.service';
import {NgForm} from '@angular/forms';
import {ErrorDetails} from '../../../core/types.core';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import {Observable} from 'rxjs/index';
import {AuthService} from '../../permission/services/auth.service';
import {UserItemService} from '../services/user-item.service';


@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {

  // Constants, variables and properties.
  // --------------------------------------------------------------------------
  public EditModeType = EditModeType;

  public set editMode(editMode: EditModeType) {
    this.userItemSvc.editMode = editMode;
  }
  public get editMode() { return this.userItemSvc.editMode; }

  @ViewChild('userForm') private userForm: NgForm;
  @ViewChild('firstname', { read: ElementRef }) private firstnameInput: ElementRef;

  public set editingUser(user: User) {
    this.userItemSvc.editingUser = user;
  }
  public get editingUser() { return this.userItemSvc.editingUser; }

  @Input()
  public set selectedUser(user: User) {
    this.userItemSvc.selectedUser = user;
  }
  public get selectedUser() { return this.userItemSvc.selectedUser; }

  @Output()
  public get dataChanged() { return this.userItemSvc.dataChanged; }


  // Methods.
  // --------------------------------------------------------------------------

  constructor(
    public authService: AuthService,
    public userItemSvc: UserItemService,
    private dialogService: DialogService) {
  }

  public ngOnInit() {
  }

  private onDataChanged() {
    this.userItemSvc.onDataChanged();
  }

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.userForm.dirty) { return true; }

    return new Promise((resolve, reject) => {
      this.dialogService.askForLeavePageWithUnsavedChanges().subscribe(dialogResult => {
        resolve(dialogResult === DialogResultType.Yes);
      });
    });
  }

  // User events.
  // --------------------------------------------------------------------------

  public onEditUser() {
    this.userItemSvc.editUser();
    this.firstnameInput.nativeElement.focus();
  }

  public onAddUser() {
    this.userItemSvc.addUser();
    this.firstnameInput.nativeElement.focus();
  }

  public onDeleteUser() {
    this.deleteUser();
  }

  public onSaveUser() {
    if (this.editMode === EditModeType.Create) {
      this.createUser();

    } else if (this.editMode === EditModeType.Update) {
      this.updateUser();
    }
  }

  public onCancelEdit() {
    this.userItemSvc.cancelEdit();
    this.userForm.form.markAsPristine();
  }

  private createUser() {
    this.userItemSvc.createUserAsync()
      .then((savedUser: User) => {
        this.userForm.form.markAsPristine();
        this.dialogService.inform('Benutzerkonto erstellen',
          'Das Benutzerkonto wurde erfolgreich erstellt.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Benutzerkonto erstellen',
            errorDetails.message || 'Die E-Mail Adresse wird bereits verwendet.');
          this.editingUser.email = '';
        } else {
          this.dialogService.inform('Benutzerkonto erstellen',
            'Bei der Erstellung des Benutzerkontos ist ein Fehler aufgetreten: ' + errorDetails.message);
        }
      });
  }

  private updateUser() {
    this.userItemSvc.updateUserAsync()
      .then((savedUser: User) => {
        this.userForm.form.markAsPristine();
        this.dialogService.inform('Benutzerkonto aktualisieren',
          'Das Benutzerkonto wurde erfolgreich aktualisiert.');
      })
      .catch((errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Benutzerkonto aktualisieren',
            errorDetails.message || 'Die E-Mail Adresse wird bereits verwendet.');
          this.editingUser.email = '';
        } else {
          this.dialogService.inform('Benutzerkonto aktualisieren',
            'Bei der Aktualisierung des Benutzerkontos ist ein Fehler aufgetreten: ' + errorDetails.message);
        }
      });
  }

  private deleteUser() {
    let userName = this.selectedUser.fullname;
    let dialogResultObs = this.dialogService.askForDelete('Benutzerkonto entfernen',
      `Soll der Benutzer '${userName}' wirklich entfernt werden ?`);

    dialogResultObs.subscribe((dialogResult: DialogResultType) => {
      if (dialogResult !== DialogResultType.Delete) { return; }
      this.userItemSvc.deleteUserAsync()
        .then((user: User) => {
          this.userForm.form.markAsPristine();
          this.dialogService.inform('Benutzer entfernen',
            `Der Benutzer '${userName}' wurde erfolgreich entfernt.`);
        })
        .catch((errorResponse) => {
          let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
          this.dialogService.inform('Benutzerkonto entfernen',
            'Beim Entfernen des Benutzerkontos ist ein Fehler aufgetreten: ' + errorDetails.message);
        });
    });
  }

}
