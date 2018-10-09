import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {EditModeType} from '../../../core/enums.core';
import {Permission} from '../../../models/permission.model';
import {PermissionBackendService} from './permission-backend.service';


@Injectable({ providedIn: 'root' })
export class PermissionItemService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public EditModeType = EditModeType;
  public editMode: EditModeType = EditModeType.Read;
  public editingPermission: Permission = new Permission();

  private _selectedPermission = new Permission();
  public set selectedPermission(permission: Permission) {
    if (permission) {
      this._selectedPermission = permission;
      this.editingPermission = Object.assign({}, permission);
      this.editMode = EditModeType.Read;
    }
  }
  public get selectedPermission() { return this._selectedPermission; }

  public dataChanged = new EventEmitter<string>(); // PermissionId: string;


  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(private permissionBackendSvc: PermissionBackendService) {
  }

  ngOnDestroy() {
  }

  public onDataChanged() {
    this.dataChanged.emit(this.editingPermission._id);
  }

  public editPermission() {
    this.editMode = this.EditModeType.Update;
  }

  public addPermission() {
    this.editMode = EditModeType.Create;
    this.editingPermission = new Permission();
  }

  public cancelEdit() {
    this.editMode = this.EditModeType.Read;
    this.editingPermission = Object.assign({}, this.selectedPermission);
  }

  private preparePermissionToSave() {
    this.editingPermission.name = this.editingPermission.name.trim();
  }

  public async createPermissionAsync(): Promise<Permission> {
    try {
      this.preparePermissionToSave();
      let savedPermission: Permission = await this.permissionBackendSvc.createPermission(this.editingPermission).toPromise();
      this.editingPermission = savedPermission;
      this.editMode = this.EditModeType.Update;
      this.onDataChanged();
      return savedPermission;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }

  public async updatePermissionAsync(): Promise<Permission> {
    try {
      this.preparePermissionToSave();
      let updatedPermission: Permission = await this.permissionBackendSvc.updatePermission(this.editingPermission).toPromise();
      this.editingPermission = updatedPermission;
      this.onDataChanged();
      return updatedPermission;
    } catch (ex) {
      return Promise.reject(ex);
    }
  }

  public async deletePermissionAsync(): Promise<Permission> {
    try {
      this.editMode = EditModeType.Delete;
      let deletedPermission: Permission = await this.permissionBackendSvc.deletePermission(this.selectedPermission).toPromise();
      this.editingPermission = new Permission();
      this.onDataChanged();
      return deletedPermission;
    } catch (ex) {
      return Promise.reject(ex);
    } finally {
      this.editMode = this.EditModeType.Read;
    }
  }

}
