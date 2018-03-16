import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {MessageService} from '../message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { testUser } from '../models/enum.model';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
}

@Injectable()
export class UserService {
  private usersUrl = 'http://localhost:3003/users';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }



  /** POST: add a new user to the server */
  register(user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl, user, httpOptions).pipe(
      tap((article: User) => this.log(`User ${user.lastname} hinzugefügt.`)),
      catchError(this.handleError<User>('addUser'))
    );
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


}
