import {Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from './message.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User, ErrorCodeType, HttpErrorArgs} from '../models/index.model';
import {Router} from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class UserService {
  private api_url = 'http://localhost:3003';
  private usersUrl = `${this.api_url}/users`;
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

  /** POST: add a new user. */
  public registerUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(this.registerUrl, user, httpOptions).pipe(
      tap((registeredUser: User) => this.log(`User ${registeredUser.lastname} hinzugefügt.`)),
      catchError(this.handlePostError)
    );
  }

  public login(strEmail, strPassword): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(
      this.loginUrl, {email: strEmail, pwd: strPassword}, httpOptions).pipe(
        map(res => res['data'] as User),
        tap((user) => {
        this.log(`Token für Benutzer '${user.firstname} ${user.lastname}' erhalten.`);
        this.setCurrentUser(user);
        // ToDo: test - remove later.
          console.log('Token: ', user.authToken);
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

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
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
