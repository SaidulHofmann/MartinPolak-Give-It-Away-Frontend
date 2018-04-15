import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {MessageService} from '../message.service';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { testUser } from '../models/index.model';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {ErrorCodes} from '../models/enum.model';
import {HttpErrorArgs} from '../models/http-error-args.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable()
export class UserService {
  private api_url = 'http://localhost:3003';
  private usersUrl = `${this.api_url}/users`;
  private registerUrl = `${this.api_url}/register`;
  private loginUrl = `${this.api_url}/login`;
  // private usersUrl = 'http://localhost:3003/users';

  private currentUsersEmail = '';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private getHttpOptions(token: string) {
    return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token
        })
    };
  }


  /** POST: add a new user in database */
  public registerUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(this.registerUrl, user, httpOptions).pipe(
      tap((registeredUser: User) => this.log(`User ${registeredUser.lastname} hinzugefügt.`)),
      catchError(this.handlePostError)
    );
  }

  public login(strEmail, strPassword): Observable<string | HttpErrorResponse> {
    console.log('UserService.login()');
    console.log('strEmail: %s, strPassword: %s', strEmail, strPassword);

    return this.http.post<string>(
      this.loginUrl, {email: strEmail, pwd: strPassword}, httpOptions).pipe(
      tap((receivedToken) => this.log(`Token '${receivedToken}' für Benutzer ${strEmail} erhalten.`)),
      catchError(this.handlePostError)
    );

  }

  public logout() {
    console.log('UserService.logout(): not implemented!');
  }

  public isAuthenticated() {
    console.log('UserService.isAuthenticated(): not implemented!');
  }

  private log(message: string) {
    this.messageService.add('User Service: ' + message);
  }


  /**
   * Returns the currently logged in User.
   */
  getCurrentUser(): Observable<User> {
    // ToDo: Implement save/load from local storage.
    return of(testUser);
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

  private handlePostError (error: HttpErrorResponse): Observable<HttpErrorResponse> {
    // Client-side or network errors.
    if(error.error instanceof ErrorEvent) {
      console.error(error);
      this.log('Die Anforderung konnte nicht zum Server gesendet werden: ' + error.error.message);
      return new ErrorObservable(new HttpErrorArgs(error, ErrorCodes.Client_Side_Or_Network_Error));

      // Server-side errors.
    } else {
      if(error.error.message.includes(ErrorCodes.MongoDB_DuplicateKey)) {
        return new ErrorObservable(new HttpErrorArgs(error, ErrorCodes.MongoDB_DuplicateKey));
      }

      console.error('UserService.handlePostError(): ', error);
      this.log('Die Anforderung konnte serverseitig nicht bearbeitet werden: ' + error.error.message);

      return new ErrorObservable(new HttpErrorArgs(error));
    }
  }

}
