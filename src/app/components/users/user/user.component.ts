import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DialogResultType, EditModeType, ErrorCodeType} from '../../../core/enums.core';
import {User} from '../../../models/user.model';
import {getErrorJSON} from '../../../core/errors.core';
import {UserService} from '../../../services/user.service';
import {DialogService} from '../../../services/dialog.service';
import {NgForm} from '@angular/forms';
import {Permission, PermissionRef} from '../../../models/permission.model';
import {LocalDataService} from '../../../services/local-data.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  // Constants, variables and properties.
  // --------------------------------------------------------------------------
  public EditModeType = EditModeType;
  public editMode: EditModeType = EditModeType.Read;
  public permissions: Permission[] = [];
  private defaultPermission: Permission = null;

  @ViewChild('userForm') private userForm: NgForm;
  @ViewChild('firstname', { read: ElementRef }) private firstnameInput: ElementRef;

  private _editingUser: User = new User();
  public set editingUser(user: User) {
    this._editingUser = user;
    this.setPermissionFromSelector();
  }
  public get editingUser() { return this._editingUser; }

  private _selectedUser = new User();
  @Input()
  public set selectedUser(user: User) {
    this._selectedUser = user;
    this.editingUser = Object.assign({}, user);
    this.editMode = EditModeType.Read;
  }
  public get selectedUser() { return this._selectedUser; }

  @Output()
  public dataChanged = new EventEmitter<void>();


  // Methods.
  // --------------------------------------------------------------------------

  constructor(
    public userService: UserService,
    private dialogService: DialogService,
    private localDataService: LocalDataService) {

    localDataService.getPermissionList().then(permissions => {
      this.permissions = permissions;
      this.defaultPermission = this.permissions.find(permission => permission.name === 'Standardbenutzer');
    });
  }

  public ngOnInit() {
  }

  private onDataChanged() {
    this.dataChanged.emit();
  }

  private setPermissionFromSelector() {
    if (!this.editingUser.permission || !this.editingUser.permission._id) { return this.defaultPermission ; }
    this.editingUser.permission = this.permissions.find(permission => permission._id === this.editingUser.permission._id);
  }

  // User events.
  // --------------------------------------------------------------------------

  public onEditUser() {
    this.editMode = this.EditModeType.Update;
    this.firstnameInput.nativeElement.focus();
  }

  public onAddUser() {
    this.editMode = EditModeType.Create;
    this.editingUser = new User();
    this.firstnameInput.nativeElement.focus();
  }

  public onDeleteUser() {
    this.editMode = EditModeType.Delete;
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
    this.editingUser = Object.assign({}, this.selectedUser);
    this.userForm.form.markAsPristine();
    this.editMode = this.EditModeType.Read;
  }


  // CRUD operations.
  // --------------------------------------------------------------------------

  private prepareUserToSave() {
    this.editingUser.firstname = this.editingUser.firstname.trim();
    this.editingUser.lastname = this.editingUser.lastname.trim();
    this.editingUser.email = this.editingUser.email.trim();
  }

  private createUser() {
    this.prepareUserToSave();
    this.userService.registerUser(this.editingUser).subscribe(
      (savedUser: User) => {
        this.editingUser = savedUser;
        this.editMode = this.EditModeType.Update;
        this.onDataChanged();
        this.dialogService.inform('Benutzerkonto erstellen',
          'Das Benutzerkonto wurde erfolgreich erstellt.');
      },
      (errorResponse) => {
        let errorJson = getErrorJSON(errorResponse);
        if (errorJson && errorJson.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Benutzerkonto erstellen',
            errorJson.message || 'Die E-Mail Adresse wird bereits verwendet.');
          this.editingUser.email = '';
        } else {
          this.dialogService.inform('Benutzerkonto erstellen',
            errorJson.message || 'Bei der Erstellung des Benutzerkontos ist ein Fehler aufgetreten.');
        }
      }
    );
  }

  private updateUser() {
    this.prepareUserToSave();
    this.userService.updateUser(this.editingUser).subscribe(
      (savedUser: User) => {
        this.editingUser = savedUser;
        this.onDataChanged();
        this.dialogService.inform('Benutzerkonto aktualisieren',
          'Das Benutzerkonto wurde erfolgreich aktualisiert.');
      },
      (errorResponse) => {
        let errorJson = getErrorJSON(errorResponse);
        if (errorJson && errorJson.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Benutzerkonto aktualisieren',
            errorJson.message || 'Die E-Mail Adresse wird bereits verwendet.');
          this.editingUser.email = '';
        } else {
          this.dialogService.inform('Benutzerkonto aktualisieren',
            errorJson.message || 'Bei der Aktualisierung des Benutzerkontos ist ein Fehler aufgetreten.');
        }
      }
    );
  }

  private deleteUser() {
    let userName = this.editingUser.firstname + ' ' + this.editingUser.lastname;
    this.dialogService.askForDelete('Benutzerkonto entfernen', `Soll der Benutzer '${userName}' wirklich entfernt werden ?`)
      .subscribe((dialogResult: DialogResultType) => {

        if (dialogResult === DialogResultType.Delete) {
          let userName = this.selectedUser.fullname;
          this.userService.deleteUser(this.selectedUser).subscribe(
            (user: User) => {
              this.onDataChanged();
              this.editingUser = new User();
              this.userForm.form.markAsPristine();
              this.editMode = this.EditModeType.Read;
              this.dialogService.inform('Benutzer entfernen', `Der Benutzer '${userName}' wurde erfolgreich entfernt.`);
            },
            (errorResponse) => {
              let errorJson = getErrorJSON(errorResponse);
              this.dialogService.inform('Benutzerkonto entfernen',
                errorJson.message || 'Beim Entfernen des Benutzerkontos ist ein Fehler aufgetreten.');
            });

        } else if (dialogResult === DialogResultType.Cancel) {
          this.editMode = this.EditModeType.Read;
        }
      });
    this.editMode = this.EditModeType.Read;
  }

}
