import {Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {User, ErrorCodeType, HttpErrorArgs} from '../models/index.model';
import {Router} from '@angular/router';
import {HttpResponseUsers, UserFilter} from '../models/user.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class UserService {
  private api_url = 'http://localhost:3003';
  private usersUrl = `${this.api_url}/api/users`;
  private registerUrl = `${this.api_url}/register`;
  private loginUrl = `${this.api_url}/login`;
  private currentUser: User = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService) {

    // Temporary
    this.loadCurrentUser();
  }

  private getHttpHeaders(): HttpHeaders {
    if (!this.getCurrentUser()) {
      console.error('Server Anfrage nicht möglich weil Benutzer nicht angemeldet.');
      this.redirectToLoginPage();
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + this.getCurrentUser().authToken
    });
  }

  private redirectToLoginPage() {
    this.router.navigate(['/users/login']);
  }

  private getHttpOptions(token: string) {
    if(!this.currentUser) {
      throw Error('Benutzer nicht angemeldet.');
    }
    return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + this.currentUser.authToken
        })
    };
  }

  /** GET users. */
  getUsers(page: number = 1, limit: number = 10): Observable<User[]> {
    return this.http.get(`${this.usersUrl}?page=${page}&limit=${limit}`,
      { headers: this.getHttpHeaders() }).pipe(
      map( res => res['data']['docs'] as User[]),
      tap(res => this.log(`Benutzer geladen.`)),
      catchError(this.handleError('getUsers', []))
    );
  }

  /** GET users. */
  getUsersByFilter(userFilter: UserFilter): Observable<any> {
    let httpParams: HttpParams = null;
    if (userFilter) {
      let httpParamsOject: any = {};
      if (userFilter._id) { httpParamsOject._id = userFilter._id; }
      if (userFilter.email) { httpParamsOject.email = userFilter.email; }
      if (userFilter.firstname) { httpParamsOject.firstname = userFilter.firstname; }
      if (userFilter.lastname) { httpParamsOject.lastname = userFilter.lastname; }

      if (userFilter.filter) { httpParamsOject.filter = userFilter.filter; }
      if (userFilter.sort) { httpParamsOject.sort = userFilter.sort; }
      if (userFilter.limit) { httpParamsOject.limit = userFilter.limit.toString(); }
      if (userFilter.page) { httpParamsOject.page = userFilter.page.toString(); }

      httpParams = new HttpParams({fromObject: httpParamsOject});
    }
    return this.http.get(this.usersUrl, { headers: this.getHttpHeaders(), params: httpParams }).pipe(
      map( res => res as HttpResponseUsers),
      tap(res => this.log(`Benutzer geladen.`)),
      catchError(this.handleError('getUsersByFilter', []))
    );
  }

  /** POST: add a new user. */
  public registerUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(this.registerUrl, user, httpOptions).pipe(
      tap((registeredUser: User) => this.log(`User ${registeredUser.lastname} hinzugefügt.`)),
      catchError(this.handlePostError)
    );
  }

  /** POST: login. */
  public login(strEmail, strPassword): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(
      this.loginUrl, {email: strEmail, pwd: strPassword}, httpOptions).pipe(
        map(res => res['data'] as User),
        tap((user) => {
        this.log(`Token für Benutzer '${user.firstname} ${user.lastname}' erhalten.`);
        this.setCurrentUser(user);
      }),
      catchError(this.handlePostError)
    );
  }

  public logout() {
    this.currentUser = null;
    this.router.navigate(['./login']);
  }

  private log(message: string) {
    this.messageService.add('User Service: ' + message);
  }

  public getCurrentUser() {
    return this.currentUser;
  }

  public get isAuthenticated() {
    return this.getCurrentUser() != null;
  }

  private getAuthToken() {
    if (this.currentUser) {
      return this.currentUser.authToken;
    } else {
      throw Error('Authentication Token nicht verfügbar weil Benutzer nicht angemeldet.');
    }
  }

  private setCurrentUser(user) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadCurrentUser() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || null);
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

  private handlePostError (error: HttpErrorResponse): Observable<never> {
    console.error('UserService.handlePostError(): ', error);
    // Client-side or network errors.
    if(error.error instanceof ErrorEvent) {
      this.log('Die Anforderung konnte nicht zum Server gesendet werden: ' + error.error.message);
      return throwError(new HttpErrorArgs(error, ErrorCodeType.Client_Side_Or_Network_Error));

      // Server-side errors.
    } else {
      if(error.status === 401) {
        return throwError(new HttpErrorArgs(error, ErrorCodeType.Authentication_Failed));
      }

      if(error.error.message.includes(ErrorCodeType.MongoDB_DuplicateKey)) {
        return throwError(new HttpErrorArgs(error, ErrorCodeType.MongoDB_DuplicateKey));
      }

      // this.log('Die Anforderung konnte serverseitig nicht bearbeitet werden: ' + error.error.message);
      return throwError(new HttpErrorArgs(error));
    }
  }


}
