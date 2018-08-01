import {HttpResponseUsers, User, UserFilter} from '../models/user.model';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs/index';
import {UserService} from '../services/user.service';
import {catchError, finalize, map} from 'rxjs/internal/operators';
import {HttpResponsePermissions, Permission, PermissionFilter} from '../models/permission.model';

/**
 * Data source for User entities that can be used for crud operations with Angular datatable.
 */
export class UserDataSource implements DataSource<User> {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public get users(): User[] {
    return this.usersSubject.getValue();
  }

  constructor(private userService: UserService) {
  }

  public connect(collectionViewer: CollectionViewer): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  public disconnect(collectionViewer: CollectionViewer): void {
    this.usersSubject.complete();
    this.loadingSubject.complete();
  }

  public loadUsers(userFilter: UserFilter) {
    this.loadingSubject.next(true);
    this.userService.getUsersByFilter(userFilter).pipe(
      map((res: HttpResponseUsers) => {
        userFilter.total = res.data.total;
        return res.data.docs;
      }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))

    ).subscribe(users => this.usersSubject.next(users));
  }
}

/**
 * Data source for Permission entities.
 */
export class PermissionDataSource implements DataSource<Permission> {

  private permissionsSubject = new BehaviorSubject<Permission[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public get permissions(): Permission[] {
    return this.permissionsSubject.getValue();
  }

  constructor(private userService: UserService) {
  }

  public connect(collectionViewer: CollectionViewer): Observable<Permission[]> {
    return this.permissionsSubject.asObservable();
  }

  public disconnect(collectionViewer: CollectionViewer): void {
    this.permissionsSubject.complete();
    this.loadingSubject.complete();
  }

  public loadPermissions(permissionFilter: PermissionFilter) {
    this.loadingSubject.next(true);
    this.userService.getPermissionsByFilter(permissionFilter).pipe(
      map((res: HttpResponsePermissions) => {
        permissionFilter.total = res.data.total;
        return res.data.docs;
      }),
      catchError(() => of([])),
      finalize(() => this.loadingSubject.next(false))

    ).subscribe(permissions =>  this.permissionsSubject.next(permissions));
  }
}
