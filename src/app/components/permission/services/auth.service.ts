import {Injectable} from '@angular/core';
import {Article, Permission, User} from '../../../models/index.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '../../../../../node_modules/@angular/common/http';
import {MessageService} from '../../shared/services/message.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from '../../../../../node_modules/rxjs';
import {apiUrl} from '../../../core/globals.core';
import { JwtHelperService } from '@auth0/angular-jwt';
import {PermissionType} from '../../../core/enums.core';
import decode from 'jwt-decode';
import {ArgumentError} from '../../../core/errors.core';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
  private apiUrl = apiUrl;
  private registerUrl = `${this.apiUrl}/register`;
  private loginUrl = `${this.apiUrl}/login`;
  private _currentUser: User = null;

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
    if (!this.currentUser) {
      throw Error('Der Zugriff auf Server Ressourcen ist nicht möglich weil der Benutzer nicht angemeldet ist.');
      this.navService.gotoLoginPage();
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.currentUser.authToken
      });
    }
  }

  public getHttpFormHeaders(): HttpHeaders {
    if (!this.currentUser) {
      throw Error('Der Zugriff auf Server Ressourcen ist nicht möglich weil der Benutzer nicht angemeldet ist.');
      this.navService.gotoLoginPage();
    } else {
      return new HttpHeaders({
        authorization: 'Bearer ' + this.currentUser.authToken
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
    this._currentUser = null;
    this.navService.gotoLoginPage();
  }

  public get currentUser() {
    return this._currentUser;
  }

  public get isAuthenticated() {
    if (this._currentUser
      && this._currentUser.authToken
      && !this.jwtHelper.isTokenExpired(this._currentUser.authToken)) {
      return true;
    } else {
      return false;
    }
  }

  private getAuthToken() {
    if (this._currentUser) {
      return this._currentUser.authToken;
    } else {
      throw Error('Authentication Token nicht verfügbar weil Benutzer nicht angemeldet.');
    }
  }

  private setCurrentUser(user) {
    this._currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private loadCurrentUser() {
    this._currentUser = JSON.parse(localStorage.getItem('currentUser') || null);
    // Set the permissions from token. The token will be invalid if changed.
    let tokenPayload = decode(this.currentUser.authToken);
    this.currentUser.permission = tokenPayload.permission as Permission;
  }


  // Permissions for managing Permissions.
  // -----------------------------------------------------------------------------

  public get canReadPermissionSettings(): boolean {
    if (!this._currentUser || !this._currentUser.permission) {
      return false;
    }
    if (this._currentUser.permission.permissionCreate
      || this._currentUser.permission.permissionRead
      || this._currentUser.permission.permissionUpdate
      || this._currentUser.permission.permissionDelete) {
      return true;
    }
    return false;
  }

  public get canCreatePermission(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.permissionCreate;
  }

  public get canReadPermission(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.permissionRead;
  }

  public get canUpdatePermission(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.permissionUpdate;
  }

  public get canDeletePermission(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.permissionDelete;
  }

  public get canSavePermission(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return (this._currentUser.permission.permissionCreate ||
      this._currentUser.permission.permissionUpdate || this._currentUser.permission.permissionDelete);
  }

  public hasPermission(permissionType: PermissionType, article: Article = null): boolean {

    switch (permissionType) {
      case PermissionType.articleOwnCreate:
        return this.currentUser.permission.articleOwnCreate; // Article does not exist when checking for creation.
      case PermissionType.articleOwnUpdate:
        return article && this.isPublisher(article) && this.currentUser.permission.articleOwnUpdate;
      case PermissionType.articleOwnDelete:
        return article && this.isPublisher(article) && this.currentUser.permission.articleOwnDelete;
      case PermissionType.articleOwnDonate:
        return article && this.isPublisher(article) && this.currentUser.permission.articleOwnDonate;

      case PermissionType.articleOtherUpdate:
        return article && !this.isPublisher(article) && this.currentUser.permission.articleOtherUpdate;
      case PermissionType.articleOtherDelete:
        return article && !this.isPublisher(article) && this.currentUser.permission.articleOtherDelete;
      case PermissionType.articleOtherDonate:
        return article && !this.isPublisher(article) && this.currentUser.permission.articleOtherDonate;

      case PermissionType.userCreate:
        return this.currentUser.permission.userCreate;
      case PermissionType.userRead:
        return this.currentUser.permission.userRead;
      case PermissionType.userUpdate:
        return this.currentUser.permission.userUpdate;
      case PermissionType.userDelete:
        return this.currentUser.permission.userDelete;

      case PermissionType.permissionCreate:
        return this.currentUser.permission.permissionCreate;
      case PermissionType.permissionRead:
        return this.currentUser.permission.permissionRead;
      case PermissionType.permissionUpdate:
        return this.currentUser.permission.permissionUpdate;
      case PermissionType.permissionDelete:
        return this.currentUser.permission.permissionDelete;

      default:
        console.log(`PermissionType '${permissionType}' not recognized.`);
        return false;
    }
  }


  // User permissions.
  // -----------------------------------------------------------------------------

  public get canReadUserSettings(): boolean {
    if (!this._currentUser || !this._currentUser.permission) {
      return false;
    }
    if (this._currentUser.permission.userCreate
      || this._currentUser.permission.userRead
      || this._currentUser.permission.userUpdate
      || this._currentUser.permission.userDelete) {
      return true;
    }
    return false;
  }

  public get canCreateUser(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.userCreate;
  }

  public get canReadUser(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.userRead;
  }

  public get canUpdateUser(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.userUpdate;
  }

  public get canDeleteUser(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.userDelete;
  }

  public get canSaveUser(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return (this._currentUser.permission.userCreate || this._currentUser.permission.userUpdate || this._currentUser.permission.userDelete);
  }


  // Article permissions.
  // -----------------------------------------------------------------------------

  public get canCreateOwnArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOwnCreate;
  }

  public get canUpdateOwnArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOwnUpdate;
  }

  public get canDeleteOwnArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOwnDelete;
  }

  public get canDonateOwnArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOwnDonate;
  }

  public get canUpdateOtherArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOtherUpdate;
  }

  public get canDeleteOtherArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOtherDelete;
  }

  public get canDonateOtherArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return this._currentUser.permission.articleOtherDonate;
  }

  public get canSaveArticle(): boolean {
    if (!this._currentUser || !this._currentUser.permission) { return false; }
    return (this._currentUser.permission.articleOwnCreate
      || this._currentUser.permission.articleOwnUpdate
      || this._currentUser.permission.articleOwnDelete
      || this._currentUser.permission.articleOwnDonate
      || this._currentUser.permission.articleOtherUpdate
      || this._currentUser.permission.articleOtherDelete
      || this._currentUser.permission.articleOtherDonate );
  }

  public canUpdateArticle(article: Article) {
    try {
      if (!this.validateArticle(article)) { return false; }
      return this.isPublisher(article) ? this.canUpdateOwnArticle : this.canUpdateOtherArticle;
    } catch (ex) {
      console.error(ex.message);
      return false;
    }
  }

  public canDeleteArticle(article: Article) {
    try {
      if (!this.validateArticle(article)) { return false; }
      return this.isPublisher(article) ? this.canDeleteOwnArticle : this.canDeleteOtherArticle;
    } catch (ex) {
      console.error(ex.message);
      return false;
    }
  }

  private validateArticle(article: Article): boolean {
    if (!article) {
      console.error(`Der Artikel ist ungültig (null).`);
      return false;
    }
    if (!article.publisher) {
      console.error(`Für den Artikel '${article.name}, id: ${article._id}' ist kein Publisher (Ersteller) definiert.`);
      return false;
    }
    return true;
  }

  public isPublisher(article: Article): boolean {
    if (!article) { throw new ArgumentError(`Das Argument 'article' ist ungültig (null).`); }
    if (!article.publisher) { throw new ArgumentError(`Das Argument 'article.publisher' ist ungültig (null).`); }

    return article.publisher._id === this.currentUser._id;
  }

  public isArticlePermission(permission: PermissionType) {
    if ([
        PermissionType.articleOwnCreate,
        PermissionType.articleOwnUpdate,
        PermissionType.articleOwnDelete,
        PermissionType.articleOwnDonate,
        PermissionType.articleOtherUpdate,
        PermissionType.articleOtherDelete,
        PermissionType.articleOtherDonate
      ].includes(permission)) {
      return true;
    } else {
      return false;
    }
  }

  public isArticleCreatePermission(permission: PermissionType) {
    return permission === PermissionType.articleOwnCreate;
  }

  public isArticleEditPermission(permission: PermissionType) {
    if ([
      PermissionType.articleOwnUpdate,
      PermissionType.articleOwnDelete,
      PermissionType.articleOwnDonate,
      PermissionType.articleOtherUpdate,
      PermissionType.articleOtherDelete,
      PermissionType.articleOtherDonate
    ].includes(permission)) {
      return true;
    } else {
      return false;
    }
  }
}
