import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {EditModeType} from '../../../core/enums.core';
import {User} from '../../../models/user.model';
import {UserBackendService} from './user-backend.service';
import {Permission} from '../../../models/permission.model';
import {DataService} from '../../shared/services/data.service';
import {defaultPermissionName} from '../../../core/globals.core';
import {AuthService} from '../../permission/services/auth.service';


@Injectable({ providedIn: 'root' })
export class UserItemService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public EditModeType = EditModeType;
  public editMode: EditModeType = EditModeType.Read;
  public permissions: Permission[] = [];
  public defaultPermission: Permission = null;

  public editingUser: User = new User();

  private _selectedUser = new User();
  public set selectedUser(user: User) {
    if (user) {
      this._selectedUser = user;
      this.editingUser = Object.assign({}, user);
      this.editMode = EditModeType.Read;
    }
  }
  public get selectedUser() { return this._selectedUser; }

  public dataChanged = new EventEmitter<string>(); // UserId: string;


  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private authService: AuthService,
    private userBackendSvc: UserBackendService,
    private localDataService: DataService) {

    this.localDataService.getPermissionListAsync(true).then(permissions => {
      this.permissions = permissions;
      this.defaultPermission = this.permissions.find(permission => permission.name === defaultPermissionName);
    });
  }

  ngOnDestroy() {
  }

  public onDataChanged() {
    this.dataChanged.emit(this.editingUser._id);
  }

  public setPermissionRefFromSelector() {
    if (!this.editingUser) { return; }
    if (!this.editingUser.permission || !this.editingUser.permission._id) {
      this.editingUser.permission = this.defaultPermission ;
    } else  {
      this.editingUser.permission = this.permissions.find(permission => permission._id === this.editingUser.permission._id);
    }
  }

  public editUser() {
    this.editMode = this.EditModeType.Update;
  }

  public addUser() {
    this.editMode = EditModeType.Create;
    this.editingUser = new User();
    this.setPermissionRefFromSelector();
  }

  public cancelEdit() {
    this.editMode = this.EditModeType.Read;
    this.editingUser = Object.assign({}, this.selectedUser);
  }

  private prepareUserToSave() {
    this.editingUser.firstname = this.editingUser.firstname.trim();
    this.editingUser.lastname = this.editingUser.lastname.trim();
    this.editingUser.email = this.editingUser.email.trim();
  }

  public async createUserAsync(): Promise<User> {
    try {
      this.prepareUserToSave();
      let savedUser: User = await this.authService.createUser(this.editingUser).toPromise();
      this.editingUser = savedUser;
      this.editMode = this.EditModeType.Update;
      this.onDataChanged();
      return savedUser;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }

  public async updateUserAsync(): Promise<User> {
    try {
      this.prepareUserToSave();
      let updatedUser: User = await this.userBackendSvc.updateUser(this.editingUser).toPromise();
      this.editingUser = updatedUser;
      this.onDataChanged();
      return updatedUser;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }

  public async deleteUserAsync(): Promise<User> {
    try {
      this.editMode = EditModeType.Delete;
      let deletedUser: User = await this.userBackendSvc.deleteUser(this.selectedUser).toPromise();
      this.editingUser = new User();
      this.onDataChanged();
      return deletedUser;
    } catch (ex) {
      return Promise.reject(ex);
    } finally {
      this.editMode = this.EditModeType.Read;
    }
  }
}
