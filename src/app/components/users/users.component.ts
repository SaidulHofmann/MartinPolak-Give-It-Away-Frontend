import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User, UserFilter} from '../../models/user.model';
import {MatPaginator, MatSort, MatSortable, Sort} from '@angular/material';
import {debounceTime, distinctUntilChanged, tap, first} from 'rxjs/internal/operators';
import {fromEvent, merge} from 'rxjs/index';
import {DialogService} from '../../services/dialog.service';
import {UserDataSource} from '../../core/data-sources.core';
import {LocalDataService} from '../../services/local-data.service';
import {Permission} from '../../models/permission.model';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  public dataSource: UserDataSource;
  public displayedColumns = ['_id', 'lastname', 'firstname', 'email'];
  private sorting: MatSortable = { id: 'name', start: 'asc', disableClear: true };
  public userFilter: UserFilter = new UserFilter();
  public selectedUser: User = new User();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef;

  constructor(
    public userService: UserService,
    private localDataService: LocalDataService,
    private dialogService: DialogService) {
  }

  public ngOnInit() {
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.loading$.subscribe(loading => {
      if (!loading && this.dataSource.users && this.dataSource.users.length > 0) {
        this.onDataLoaded();
      }
    });
    this.loadFilter();
    this.loadSorting();
    this.loadUsersPage();
  }

  public ngAfterViewInit() {
    // Server-side search (observable from keyup event).
    fromEvent(this.filterInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.userFilter.filter = this.filterInput.nativeElement.value;
        this.saveFilter();
        this.loadUsersPage();
      })
    ).subscribe();

    // On sort events load sorted data from backend.
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.userFilter.page = 1;
      this.updateSortInUserFilter(this.sort);
      this.saveSorting();
      this.loadUsersPage();
    });

    // On paginate events load a new page.
    this.paginator.page.subscribe(() => {
      this.loadUsersPage();
    });
  }

  public onRowClicked(user: User) {
    this.selectedUser = user;
    this.saveSelectedUser();
  }

  private onDataLoaded() {
    this.loadSelectedUser();
  }

  public onDataChanged() {
    this.loadUsersPage();
  }

  private loadUsersPage() {
    this.userFilter.page = this.paginator.pageIndex + 1;
    this.userFilter.limit = this.paginator.pageSize;
    this.dataSource.loadUsers(this.userFilter);
  }

  private updateSortInUserFilter(sort: Sort) {
    if (!sort.active) {
      this.userFilter.sort = '';
    } else {
      this.setSortField(sort.active, sort.direction === 'asc');
    }
    this.saveFilter();
  }

  private setSortField(sortField: string, isSortDirAscending: boolean) {
    this.userFilter.sort = isSortDirAscending ? sortField : '-' + sortField;
  }



  // Manage settings.

  private saveSelectedUser() {
    this.localDataService.saveObject('UsersComponent.selectedUser', this.selectedUser);
  }

  private loadSelectedUser() {
    let loadedUser: User = this.localDataService.loadObject('UsersComponent.selectedUser');
    if (loadedUser) {
      let userRef = this.dataSource.users.find(u => u._id === loadedUser._id);
      if (userRef) {
        this.selectedUser = userRef;
        return;
      }
    }
    this.selectedUser = new User();
  }

  private saveSorting() {
    let sortDirection: 'asc' | 'desc' = this.sort.direction as 'asc' | 'desc';
    let sorting: MatSortable = { id: this.sort.active, start: sortDirection, disableClear: true };
    this.localDataService.saveObject('UsersComponent.sorting', sorting);
  }

  private loadSorting() {
    let loadedSorting: MatSortable = this.localDataService.loadObject('UsersComponent.sorting');
    if (loadedSorting) {
      this.sorting = loadedSorting;
      this.sort.sort(this.sorting);
      this.updateSortInUserFilter(this.sort);
    }
  }
  private saveFilter() {
    this.localDataService.saveObject('UsersComponent.userFilter', this.userFilter);
  }

  private loadFilter() {
    this.userFilter = this.localDataService.loadObject('UsersComponent.userFilter');
    if (!this.userFilter) {
      this.userFilter = new UserFilter();
      return;
    }
    if (this.userFilter.filter) {
      this.filterInput.nativeElement.value = this.userFilter.filter;
    } else {
      this.filterInput.nativeElement.value = '';
    }
  }

}

