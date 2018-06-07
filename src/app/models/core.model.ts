import {HttpErrorResponse} from '@angular/common/http';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {HttpResponseUsers, User, UserFilter} from './user.model';
import {BehaviorSubject, Observable, of} from 'rxjs/index';
import {UserService} from '../services/user.service';
import {catchError, finalize, map} from 'rxjs/internal/operators';

export class IdNamePair {
  _id = '';
  name = '';
}

export class Pager {
  totalItems:   number = 0;
  currentPage:  number = 0;
  pageSize:     number = 0;
  totalPages:   number = 0;
  startPage:    number = 0;
  endPage:      number = 0;
  startIndex:   number = 0;
  endIndex:     number = 0;
  pages:        number[] = [];
}

export class DialogConfig {
  title: string;
  message: string;

  hasOkButton: boolean = false;
  hasYesButton: boolean = false;
  hasNoButton: boolean = false;
  hasSaveButton: boolean = false;
  hasDeleteButton: boolean = false;
  hasCancelButton: boolean = false;
}

export class HttpErrorArgs {
  constructor(
    public error: HttpErrorResponse,
    public errorCode: string = ''
  ) { }
}

export class UsersDataSource implements DataSource<User> {

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


}
