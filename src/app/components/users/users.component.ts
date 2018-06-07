import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UsersDataSource} from '../../models/core.model';
import {UserFilter} from '../../models/user.model';
import {MatPaginator, MatSort, Sort} from '@angular/material';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/internal/operators';
import {fromEvent, merge} from 'rxjs/index';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  public dataSource: UsersDataSource;
  public displayedColumns = ['lastname', 'firstname', 'email', '_id'];
  public userFilter: UserFilter = new UserFilter();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private userService: UserService) { }

  public ngOnInit() {
    this.dataSource = new UsersDataSource(this.userService);
    this.dataSource.loadUsers(this.userFilter);
  }

  public ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup').pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        this.loadUsersPage();
      })
    ).subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => {
      this.setSort(this.sort);
      this.paginator.pageIndex = 0;
      this.userFilter.page = 1;
    });

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page).pipe(
      tap(() => this.loadUsersPage())
    ).subscribe();
  }

  private loadUsersPage() {
    // Define sort and filter.
    this.userFilter.filter = this.input.nativeElement.value;
    this.userFilter.page = this.paginator.pageIndex + 1;
    this.userFilter.limit = this.paginator.pageSize;

    this.dataSource.loadUsers(this.userFilter);
  }

  public setSort(sort: Sort) {
    if(!sort.active) {
      this.userFilter.sort = '';
      return;
    }
    this.setSortField(sort.active, sort.direction === 'asc');
  }

  private setSortField(sortField: string, isSortDirAscending: boolean) {
    this.userFilter.sort = isSortDirAscending ? sortField : '-' + sortField;
  }

  public onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

}

