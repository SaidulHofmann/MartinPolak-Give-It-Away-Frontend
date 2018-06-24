import {HttpResponseUsers, User, UserFilter} from '../models/user.model';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, of} from 'rxjs/index';
import {UserService} from '../services/user.service';
import {catchError, finalize, map} from 'rxjs/internal/operators';

/**
 * Data source for User entities that can be used for crud operations with Angular datatable.
 */
export class UserDataSource implements DataSource<User> {

  private usersSubject = new BehaviorSubject<User[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

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
    )
      .subscribe(users => this.usersSubject.next(users));

  }

  public addRow(): User {
    let user = new User();
    this.usersSubject.next([user]);
    return user;
  }

}
