import {Injectable, OnDestroy} from '@angular/core';
import {UserDataSource} from '../../../core/data-sources.core';
import {MatSort, MatSortable} from '@angular/material';
import {User, UserFilter} from '../../../models/user.model';
import {DataService} from '../../shared/services/data.service';
import {UserBackendService} from './user-backend.service';
import {Subscription} from '../../../../../node_modules/rxjs';


@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  private subscriptions: Subscription;
  public dataSource: UserDataSource;
  public displayedColumns = ['_id', 'lastname', 'firstname', 'email'];

  /** Sort settings for MatSort directive. */
  public sort: MatSortable = { id: 'name', start: 'asc', disableClear: true };

  /** Filter and sort settings for loading data from backend. */
  public userFilter: UserFilter = new UserFilter();

  public selectedUser: User = new User();


  // Methods
  // ----------------------------------
  constructor(
    private userBackendSvc: UserBackendService,
    private localDataService: DataService) {
    this.init();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public init() {
    this.loadPageSize();
    this.dataSource = new UserDataSource(this.userBackendSvc);
    this.dataSource.loadUsers(this.userFilter);

    this.subscriptions = this.dataSource.loading$.subscribe(loading => {
      if (!loading && this.dataSource.users && this.dataSource.users.length > 0) {
        this.onDataLoaded();
      }
    });
  }

  private onDataLoaded() {
    this.setSelectedUserRef();
  }

  public loadUsersPage() {
    this.dataSource.loadUsers(this.userFilter);
  }

  private setSelectedUserRef() {
    if (this.selectedUser) {
      let userRef = this.dataSource.users.find(u => u._id === this.selectedUser._id);
      if (userRef) {
        this.selectedUser = userRef;
      }
    }
  }

  public setSort(sort: MatSort) {
    this.sort = {id: sort.active, start: sort.direction as 'asc' | 'desc', disableClear: true};
  }

  // Persistence
  // ----------------------------------

  public savePageSize() {
    this.localDataService.saveObject('UserService.userFilter.limit', this.userFilter.limit);
  }

  public loadPageSize() {
    let loadedPageSize: number = this.localDataService.loadObject('UserService.userFilter.limit');
    if (loadedPageSize) {
      this.userFilter.limit = loadedPageSize;
    }
  }
}
