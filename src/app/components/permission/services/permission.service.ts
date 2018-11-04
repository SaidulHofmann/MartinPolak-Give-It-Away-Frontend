import {Injectable, OnDestroy} from '@angular/core';
import {PermissionDataSource} from '../../../core/data-sources.core';
import {MatSort, MatSortable} from '@angular/material';
import {Permission, PermissionFilter} from '../../../models/permission.model';
import {Subscription} from '../../../../../node_modules/rxjs';
import {DataService} from '../../shared/services/data.service';
import {PermissionBackendService} from './permission-backend.service';


@Injectable({ providedIn: 'root' })
export class PermissionService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  private subscriptions: Subscription;
  public dataSource: PermissionDataSource;
  public displayedColumns = ['_id', 'name', 'isPredefined'];

  /** Sort settings for MatSort directive. */
  public sort: MatSortable = {id: 'name', start: 'asc', disableClear: true};

  /** Filter and sort settings for loading data from backend. */
  public permissionFilter: PermissionFilter = new PermissionFilter();

  public selectedPermission: Permission = new Permission();


  // Methods
  // ----------------------------------
  constructor(
    private permissionBackendSvc: PermissionBackendService,
    private localDataService: DataService) {
    this.init();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public init() {
    this.loadPageSize();
    this.dataSource = new PermissionDataSource(this.permissionBackendSvc);
    this.dataSource.loadPermissions(this.permissionFilter);

    this.subscriptions = this.dataSource.loading$.subscribe(loading => {
      if (!loading && this.dataSource.permissions && this.dataSource.permissions.length > 0) {
        this.onDataLoaded();
      }
    });
  }

  private onDataLoaded() {
    this.setSelectedPermissionRef();
  }

  public loadPermissionsPage() {
    this.dataSource.loadPermissions(this.permissionFilter);
  }

  private setSelectedPermissionRef() {
    if (this.selectedPermission) {
      let permissionRef = this.dataSource.permissions.find(p => p._id === this.selectedPermission._id);
      if (permissionRef) {
        this.selectedPermission = permissionRef;
      }
    }
  }

  public setSort(sort: MatSort) {
    this.sort = {id: sort.active, start: sort.direction as 'asc' | 'desc', disableClear: true};
  }

  // Persistence
  // ----------------------------------

  public savePageSize() {
    this.localDataService.saveObject('PermissionService.permissionFilter.limit', this.permissionFilter.limit);
  }

  public loadPageSize() {
    let loadedPageSize: number = this.localDataService.loadObject('PermissionService.permissionFilter.limit');
    if (loadedPageSize) {
      this.permissionFilter.limit = loadedPageSize;
    }
  }

}
