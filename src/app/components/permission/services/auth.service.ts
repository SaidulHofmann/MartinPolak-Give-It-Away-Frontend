import {Injectable} from '@angular/core';
import {User} from '../../../models/index.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '../../../../../node_modules/@angular/common/http';
import {MessageService} from '../../shared/services/message.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from '../../../../../node_modules/rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  private api_url = 'http://localhost:3003';
  private registerUrl = `${this.api_url}/register`;
  private loginUrl = `${this.api_url}/login`;
  private currentUser: User = null;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private navService: NavigationService) {

    // Temporary
    this.loadCurrentUser();
  }

  private log(message: string) {
    this.messageService.add('User Service: ' + message);
  }

  public getHttpHeaders(): HttpHeaders {
    if (!this.getCurrentUser()) {
      throw Error('Der Zugriff auf Server Ressourcen ist nicht möglich weil der Benutzer nicht angemeldet ist.');
      this.navService.gotoLoginPage();
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.getCurrentUser().authToken
      });
    }
  }

  /** POST: add a new user (register user). */
  public createUser(user: User): Observable<User> {
    return this.http.post<User>(this.registerUrl, user, this.httpOptions).pipe(
      map(res  => res['data'] as User),
      tap((createdUser: User) => this.log(`User ${createdUser.lastname} hinzugefügt.`))
    );
  }

  /** POST: login. */
  public login(strEmail, strPassword): Observable<User | HttpErrorResponse> {
    return this.http.post<User>(
      this.loginUrl, {email: strEmail, pwd: strPassword}, this.httpOptions).pipe(
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
