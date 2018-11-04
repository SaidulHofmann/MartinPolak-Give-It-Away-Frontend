import {Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../../shared/services/message.service';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {User} from '../../../models/index.model';
import {Router} from '@angular/router';
import {HttpResponseUsers, UserFilter} from '../../../models/user.model';
import {HttpErrorArgs} from '../../../core/types.core';
import {ErrorCodeType} from '../../../core/enums.core';
import {NavigationService} from '../../shared/services/navigation.service';
import {AuthService} from '../../permission/services/auth.service';
import {apiUrl} from '../../../core/globals.core';


@Injectable({
  providedIn: 'root'
})
export class UserBackendService {
  private apiUrl = apiUrl;
  private usersUrl = `${this.apiUrl}/api/users`;
  private permissionsUrl = `${this.apiUrl}/api/permissions`;

  private get httpHeaders() { return this.authService.getHttpHeaders(); }

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private navService: NavigationService) {
  }

  /** GET users. */
  public getUsers(page: number = 1, limit: number = 10): Observable<User[]> {
    return this.http.get(`${this.usersUrl}?page=${page}&limit=${limit}`,
      { headers: this.httpHeaders }).pipe(
      map( res => res['data']['docs'] as User[]),
      tap(res => this.log(`Benutzer geladen.`)),
      catchError(this.handleError('getUsers', []))
    );
  }

  /** GET users. */
  public getUsersByFilter(userFilter: UserFilter): Observable<any> {
    let httpParams: HttpParams = null;
    if (userFilter) {
      let httpParamsObject: any = {};
      if (userFilter._id) { httpParamsObject._id = userFilter._id; }
      if (userFilter.email) { httpParamsObject.email = userFilter.email; }
      if (userFilter.firstname) { httpParamsObject.firstname = userFilter.firstname; }
      if (userFilter.lastname) { httpParamsObject.lastname = userFilter.lastname; }

      if (userFilter.filter) { httpParamsObject.filter = userFilter.filter; }
      if (userFilter.sort) { httpParamsObject.sort = userFilter.sort; }
      if (userFilter.limit) { httpParamsObject.limit = userFilter.limit.toString(); }
      if (userFilter.page) { httpParamsObject.page = userFilter.page.toString(); }

      httpParams = new HttpParams({fromObject: httpParamsObject});
    }
    return this.http.get(this.usersUrl, { headers: this.httpHeaders, params: httpParams }).pipe(
      map( res => res as HttpResponseUsers),
      tap(res => this.log(`Benutzer geladen.`)),
      catchError(this.handleError('getUsersByFilter', []))
    );
  }

  /** PUT: update an user. */
  public updateUser(user: User): Observable<User> {
    return this.http.put(this.usersUrl, user, { headers: this.httpHeaders }).pipe(
      map(res  => res['data'] as User),
      tap((userRes: User) => this.log(`Benutzer mit name = '${userRes.fullname}' und id = '${userRes._id}' wurde aktualisiert.`))
    );
  }

  /** DELETE: delete an user in database. */
  public deleteUser(user: User | string): Observable<User> {
    let id, fullname = '';
    if (typeof user === 'string') {
      id = user;
    } else {
      id = user._id;
      fullname = user.fullname;
    }
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, { headers: this.httpHeaders }).pipe(
      map(res  => res['data'] as User),
      tap(_ => this.log(`Benutzer mit name = '${fullname}' und id = '${id}' wurde gelöscht.`))
    );
  }

  private log(message: string) {
    this.messageService.add('User Service: ' + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
