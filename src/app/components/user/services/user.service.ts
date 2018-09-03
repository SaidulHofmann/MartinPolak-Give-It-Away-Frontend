import {Injectable} from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {MessageService} from '../../shared/services/message.service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {HttpResponsePermissions, Permission, PermissionFilter, User} from '../../../models/index.model';
import {Router} from '@angular/router';
import {HttpResponseUsers, UserFilter} from '../../../models/user.model';
import {HttpErrorArgs} from '../../../core/types.core';
import {ErrorCodeType} from '../../../core/enums.core';
import {Article} from '../../../models/article.model';
import {DialogService} from '../../shared/services/dialog.service';
import {NavigationService} from '../../shared/services/navigation.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api_url = 'http://localhost:3003';
  private usersUrl = `${this.api_url}/api/users`;
  private permissionsUrl = `${this.api_url}/api/permissions`;
  private registerUrl = `${this.api_url}/register`;
  private loginUrl = `${this.api_url}/login`;
  private currentUser: User = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private navService: NavigationService,
    private dialogService: DialogService) {

    // Temporary
    this.loadCurrentUser();
  }

  public getHttpHeaders(): HttpHeaders {
    if (!this.getCurrentUser()) {
      this.showAccessDeniedMessage();
      this.navService.gotoLoginPage();
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.getCurrentUser().authToken
      });
    }
  }

  private showAccessDeniedMessage() {
    this.dialogService.inform('Server Anforderung',
      'Der Zugriff auf Server Ressourcen ist nicht möglich weil der Benutzer nicht angemeldet ist.');
  }



  /** GET users. */
  public getUsers(page: number = 1, limit: number = 10): Observable<User[]> {
    return this.http.get(`${this.usersUrl}?page=${page}&limit=${limit}`,
      { headers: this.getHttpHeaders() }).pipe(
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
    return this.http.get(this.usersUrl, { headers: this.getHttpHeaders(), params: httpParams }).pipe(
      map( res => res as HttpResponseUsers),
      tap(res => this.log(`Benutzer geladen.`)),
      catchError(this.handleError('getUsersByFilter', []))
    );
  }

  /** POST: add a new user. */
  public registerUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(this.registerUrl, user, httpOptions).pipe(
      map(res  => res['data'] as User),
      tap((registeredUser: User) => this.log(`User ${registeredUser.lastname} hinzugefügt.`))
    );
  }

  /** POST: login. */
  public login(strEmail, strPassword): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(
      this.loginUrl, {email: strEmail, pwd: strPassword}, httpOptions).pipe(
        map(res => res['data'] as User),
        tap((user: User) => {
        this.log(`Token für Benutzer '${user.firstname} ${user.lastname}' erhalten.`);
        this.setCurrentUser(user);
      })
    );
  }

  public logout() {
    this.currentUser = null;
    this.navService.gotoLoginPage();
  }

  /** PUT: update an user. */
  public updateUser(user: User): Observable<User | HttpErrorResponse> {
    return this.http.put(this.usersUrl, user, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as User),
      tap((userRes: User) => this.log(`Benutzer mit name = '${userRes.fullname}' und id = '${userRes._id}' wurde aktualisiert.`))
    );
  }

  /** DELETE: delete an user in database. */
  public deleteUser(user: User | string): Observable<User | HttpErrorResponse> {
    let id, fullname = '';
    if (typeof user === 'string') {
      id = user;
    } else {
      id = user._id;
      fullname = user.fullname;
    }
    const url = `${this.usersUrl}/${id}`;

    return this.http.delete<User>(url, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as User),
      tap(_ => this.log(`Benutzer mit name = '${fullname}' und id = '${id}' wurde gelöscht.`))
    );
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

      if(error.error.message.includes(ErrorCodeType.DuplicateKeyError)) {
        return throwError(new HttpErrorArgs(error, ErrorCodeType.DuplicateKeyError));
      }

      // this.log('Die Anforderung konnte serverseitig nicht bearbeitet werden: ' + error.error.message);
      return throwError(new HttpErrorArgs(error));
    }
  }

  // User access rights.
  // -----------------------------------------------------------------------------

  public canReadUserSettings(): boolean {
    if (!this.currentUser || !this.currentUser.permission) {
      return false;
    }
    if (this.currentUser.permission.userCreate
      || this.currentUser.permission.userRead
      || this.currentUser.permission.userUpdate
      || this.currentUser.permission.userDelete) {
      return true;
    }
    return false;
  }

  public canCreateUser(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.userCreate;
  }

  public canReadUser(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.userRead;
  }

  public canUpdateUser(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.userUpdate;
  }

  public canDeleteUser(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.userDelete;
  }

  public canSaveUser(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return (this.currentUser.permission.userCreate || this.currentUser.permission.userUpdate || this.currentUser.permission.userDelete);
  }


  // Permissions
  // -----------------------------------------------------------------------------

  /** GET permissions. */
  public getPermissionsByFilter(permissionFilter: PermissionFilter): Observable<any> {
    let httpParams: HttpParams = null;
    if (permissionFilter) {
      let httpParamsObject: any = {};
      if (permissionFilter._id) { httpParamsObject._id = permissionFilter._id; }
      if (permissionFilter.name) { httpParamsObject.name = permissionFilter.name; }
      if (permissionFilter.isPredefined) { httpParamsObject.isPredefined = permissionFilter.isPredefined.toString(); }

      if (permissionFilter.filter) { httpParamsObject.filter = permissionFilter.filter; }
      if (permissionFilter.sort) { httpParamsObject.sort = permissionFilter.sort; }
      if (permissionFilter.limit) { httpParamsObject.limit = permissionFilter.limit.toString(); }
      if (permissionFilter.page) { httpParamsObject.page = permissionFilter.page.toString(); }

      httpParams = new HttpParams({fromObject: httpParamsObject});
    }
    return this.http.get(this.permissionsUrl, { headers: this.getHttpHeaders(), params: httpParams }).pipe(
      map( res => res as HttpResponsePermissions),
      tap(res => this.log(`Berechtigungs-Einträge geladen.`)),
      catchError(this.handleError('getPermissionsByFilter', []))
    );
  }

  /** POST: create a new permission entry. */
  public createPermission(permission: Permission): Observable<Permission | HttpErrorResponse> {
    return this.http.post<Permission>(this.permissionsUrl, permission, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Permission),
      tap((createdPermission: Permission) => this.log(`Berechtigungs-Eintrag ${createdPermission.name} hinzugefügt.`))
    );
  }

  /** PUT: update a permission entry. */
  public updatePermission(permission: Permission): Observable<Permission | HttpErrorResponse> {
    return this.http.put<Permission>(this.permissionsUrl, permission, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Permission),
      tap((updatedPermission: Permission) =>
        this.log(`Berechtigungs-Eintrag mit name = '${updatedPermission.name}' und id = '${updatedPermission._id}' wurde aktualisiert.`))
    );
  }

  /** DELETE: delete a permission entry in database. */
  public deletePermission(permission: Permission): Observable<Permission | HttpErrorResponse> {
    let { id, name } = { id: permission._id, name: permission.name };
    const url = `${this.permissionsUrl}/${id}`;

    return this.http.delete<Permission>(url, { headers: this.getHttpHeaders() }).pipe(
      map(res  => res['data'] as Permission),
      tap(_ => this.log(`Berechtigungs-Eintrag mit name = '${name}' und id = '${id}' wurde gelöscht.`))
    );
  }

  // Permissions access rights.
  // -----------------------------------------------------------------------------

  public canReadPermissionSettings(): boolean {
    if (!this.currentUser || !this.currentUser.permission) {
      return false;
    }
    if (this.currentUser.permission.permissionCreate
      || this.currentUser.permission.permissionRead
      || this.currentUser.permission.permissionUpdate
      || this.currentUser.permission.permissionDelete) {
      return true;
    }
    return false;
  }

  public canCreatePermission(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.permissionCreate;
  }

  public canReadPermission(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.permissionRead;
  }

  public canUpdatePermission(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.permissionUpdate;
  }

  public canDeletePermission(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.permissionDelete;
  }

  public canSavePermission(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return (this.currentUser.permission.permissionCreate ||
      this.currentUser.permission.permissionUpdate || this.currentUser.permission.permissionDelete);
  }

  // Article access rights.
  // -----------------------------------------------------------------------------

  public canCreateOwnArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOwnCreate;
  }

  public canUpdateOwnArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOwnUpdate;
  }

  public canDeleteOwnArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOwnDelete;
  }

  public canDonateOwnArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOwnDonate;
  }

  public canUpdateOtherArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOtherUpdate;
  }

  public canDeleteOtherArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOtherDelete;
  }

  public canDonateOtherArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return this.currentUser.permission.articleOtherDonate;
  }

  public canSaveArticle(): boolean {
    if (!this.currentUser || !this.currentUser.permission) { return false; }
    return (this.currentUser.permission.articleOwnCreate || this.currentUser.permission.articleOwnUpdate
      || this.currentUser.permission.articleOwnDelete || this.currentUser.permission.articleOwnDonate
      || this.currentUser.permission.articleOtherUpdate || this.currentUser.permission.articleOtherDelete
      || this.currentUser.permission.articleOtherDonate );
  }
}
