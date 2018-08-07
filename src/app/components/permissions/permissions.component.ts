import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '../../services/dialog.service';
import {UserService} from '../../services/user.service';
import {PermissionDataSource} from '../../core/data-sources.core';
import {Permission, PermissionFilter} from '../../models/permission.model';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {fromEvent, merge} from 'rxjs/index';
import {MatPaginator, MatSort, MatSortable, PageEvent, Sort} from '@angular/material';
import {LocalDataService} from '../../services/local-data.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, AfterViewInit {

  public dataSource: PermissionDataSource;
  public displayedColumns = ['_id', 'name', 'isPredefined'];
  private sorting: MatSortable = { id: 'name', start: 'asc', disableClear: true };
  public permissionFilter: PermissionFilter = new PermissionFilter();
  private currentPageSize = this.permissionFilter.limit;  // Enables detection of pageSize change. The paginator uses permissionFilter.
  public selectedPermission: Permission = new Permission();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef;

  constructor(
    public userService: UserService,
    private localDataService: LocalDataService,
    private dialogService: DialogService) { }

  public ngOnInit() {
    this.dataSource = new PermissionDataSource(this.userService);
    this.dataSource.loading$.subscribe(loading => {
      if (!loading && this.dataSource.permissions && this.dataSource.permissions.length > 0) {
        this.onDataLoaded();
      }
    });
    this.loadFilter();
    this.loadSorting();
    this.loadPaging();
    this.loadPermissionsPage();
  }

  public ngAfterViewInit() {
    // Server-side search (observable from keyup event).
    fromEvent(this.filterInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.permissionFilter.filter = this.filterInput.nativeElement.value.trim();
        this.saveFilter();
        this.loadPermissionsPage();
      })
    ).subscribe();

    // On sort events load sorted data from backend.
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.permissionFilter.page = 1;
      this.updateSortInPermissionFilter(this.sort);
      this.saveSorting();
      this.loadPermissionsPage();
    });

    // On paginate events load a new page.
    this.paginator.page.subscribe((pageEvent: PageEvent) => {
      if (this.currentPageSize !== pageEvent.pageSize) {
        this.currentPageSize = pageEvent.pageSize;
        this.savePaging();
      }
      this.loadPermissionsPage();
    });
  }

  public onRowClicked(permission: Permission) {
    this.selectedPermission = permission;
    this.saveSelectedPermission();
  }

  private onDataLoaded() {
    this.loadSelectedPermission();
  }

  public onDataChanged() {
    this.loadPermissionsPage();
  }

  private loadPermissionsPage() {
    this.permissionFilter.page = this.paginator.pageIndex + 1;
    this.permissionFilter.limit = this.paginator.pageSize;
    this.dataSource.loadPermissions(this.permissionFilter);
  }

  private updateSortInPermissionFilter(sort: Sort) {
    if (!sort.active) {
      this.permissionFilter.sort = '';
    } else {
      this.setSortField(sort.active, sort.direction === 'asc');
    }
  }

  private setSortField(sortField: string, isSortDirAscending: boolean) {
    this.permissionFilter.sort = isSortDirAscending ? sortField : '-' + sortField;
  }


  // Manage settings.

  private saveSelectedPermission() {
    this.localDataService.saveObject('PermissionsComponent.selectedPermission', this.selectedPermission);
  }

  private loadSelectedPermission() {
    let loadedPermission: Permission = this.localDataService.loadObject('PermissionsComponent.selectedPermission');
    if (loadedPermission) {
      let permissionRef = this.dataSource.permissions.find(p => p._id === loadedPermission._id);
      if (permissionRef) {
        this.selectedPermission = permissionRef;
        return;
      }
    }
    this.selectedPermission = new Permission();
  }

  private saveSorting() {
    let sorting: MatSortable = { id: this.sort.active, start: this.sort.direction as 'asc' | 'desc', disableClear: true };
    this.localDataService.saveObject('PermissionsComponent.sorting', sorting);
  }

  private loadSorting() {
    let loadedSorting: MatSortable = this.localDataService.loadObject('PermissionsComponent.sorting');
    if (loadedSorting) {
      this.sorting = loadedSorting;
      this.sort.sort(this.sorting);
      this.updateSortInPermissionFilter(this.sort);
    }
  }

  private saveFilter() {
    this.localDataService.saveObject('PermissionsComponent.permissionFilter.filter', this.permissionFilter.filter);
  }

  private loadFilter() {
    let loadedPermissionFilter: string = this.localDataService.loadObject('PermissionsComponent.permissionFilter.filter');
    if (loadedPermissionFilter) {
      this.permissionFilter.filter = loadedPermissionFilter;
      this.filterInput.nativeElement.value = loadedPermissionFilter;
    } else {
      this.permissionFilter.filter = '';
      this.filterInput.nativeElement.value = '';
    }
  }

  private savePaging() {
    this.localDataService.saveObject('PermissionsComponent.currentPageSize', this.currentPageSize);
  }

  private loadPaging() {
    let loadedPageSize: number = this.localDataService.loadObject('PermissionsComponent.currentPageSize');
    if (loadedPageSize) {
      this.paginator._changePageSize(loadedPageSize);
      this.currentPageSize = loadedPageSize;
    }
  }

}
