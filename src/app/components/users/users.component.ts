import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User, UserFilter} from '../../models/user.model';
import {MatPaginator, MatSort, Sort} from '@angular/material';
import {debounceTime, distinctUntilChanged, tap, first} from 'rxjs/internal/operators';
import {fromEvent, merge} from 'rxjs/index';
import {DialogService} from '../../services/dialog.service';
import {UserDataSource} from '../../core/data-sources.core';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  public dataSource: UserDataSource;
  public displayedColumns = ['_id', 'lastname', 'firstname', 'email'];
  public userFilter: UserFilter = new UserFilter();
  public selectedUser: User = new User();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filterInput') filterInput: ElementRef;

  constructor(
    public userService: UserService,
    private dialogService: DialogService) { }


  public ngOnInit() {
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.loadUsers(this.userFilter);
  }

  public ngAfterViewInit() {
    // Server-side search (observable from keyup event).
    fromEvent(this.filterInput.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadUsersPage();
      })
    ).subscribe();

    // Reset the paginator after sorting.
    this.sort.sortChange.subscribe(() => {
      this.setSort(this.sort);
      this.paginator.pageIndex = 0;
      this.userFilter.page = 1;
    });

    // On sort or paginate events, load a new page.
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadUsersPage())
    ).subscribe();
  }

  public onRowClicked(user: User) {
    this.selectedUser = user;
  }

  public onDataChanged() {
    this.loadUsersPage();
  }

  private loadUsersPage() {
    this.setUserFilter();
    this.dataSource.loadUsers(this.userFilter);
  }

  private setUserFilter() {
    this.userFilter.filter = this.filterInput.nativeElement.value;
    this.userFilter.page = this.paginator.pageIndex + 1;
    this.userFilter.limit = this.paginator.pageSize;
  }

  private setSort(sort: Sort) {
    if (!sort.active) {
      this.userFilter.sort = '';
      return;
    }
    this.setSortField(sort.active, sort.direction === 'asc');
  }

  private setSortField(sortField: string, isSortDirAscending: boolean) {
    this.userFilter.sort = isSortDirAscending ? sortField : '-' + sortField;
  }

}

