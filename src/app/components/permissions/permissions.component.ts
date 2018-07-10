import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '../../services/dialog.service';
import {UserService} from '../../services/user.service';
import {PermissionDataSource} from '../../core/data-sources.core';
import {Permission, PermissionFilter} from '../../models/permission.model';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {fromEvent, merge} from 'rxjs/index';
import {MatPaginator, MatSort, Sort} from '@angular/material';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, AfterViewInit {

  public dataSource: PermissionDataSource;
  public displayedColumns = ['_id', 'name', 'isPredefined'];
  public permissionFilter: PermissionFilter = new PermissionFilter();
  public selectedPermission: Permission = new Permission();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef;

  constructor(
    public userService: UserService,
    private dialogService: DialogService) { }

  public ngOnInit() {
    this.dataSource = new PermissionDataSource(this.userService);
    this.dataSource.loadPermissions(this.permissionFilter);
  }

  public ngAfterViewInit() {
    // Server-side search (observable from keyup event).
    fromEvent(this.filterInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadPermissionsPage();
      })
    ).subscribe();

    // Reset the paginator after sorting.
    this.sort.sortChange.subscribe(() => {
      this.setSort(this.sort);
      this.paginator.pageIndex = 0;
      this.permissionFilter.page = 1;
    });

    // On sort or paginate events, load a new page.
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadPermissionsPage())
    ).subscribe();
  }

  public onRowClicked(permission: Permission) {
    this.selectedPermission = permission;
  }

  public onDataChanged() {
    this.loadPermissionsPage();
  }

  private loadPermissionsPage() {
    this.setPermissionFilter();
    this.dataSource.loadPermissions(this.permissionFilter);
  }

  private setPermissionFilter() {
    this.permissionFilter.filter = this.filterInput.nativeElement.value;
    this.permissionFilter.page = this.paginator.pageIndex + 1;
    this.permissionFilter.limit = this.paginator.pageSize;
  }

  private setSort(sort: Sort) {
    if (!sort.active) {
      this.permissionFilter.sort = '';
      return;
    }
    this.setSortField(sort.active, sort.direction === 'asc');
  }

  private setSortField(sortField: string, isSortDirAscending: boolean) {
    this.permissionFilter.sort = isSortDirAscending ? sortField : '-' + sortField;
  }

}
