import {Injectable, OnDestroy} from '@angular/core';
import {ArticleFilter} from '../models/article.model';
import {Permission, PermissionRef} from '../models/permission.model';
import {map} from 'rxjs/operators';
import {DialogService} from './dialog.service';
import {UserService} from './user.service';
import {NavigationService} from './navigation.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService implements OnDestroy {
  // tslint:disable:member-ordering

  // Constants, variables
  // ----------------------------------
  public articleFilter: ArticleFilter = null;
  private _api_url = 'http://localhost:3003';
  private _permissionUrl = `${this._api_url}/api/permissions`;

  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor(
    private httpClient: HttpClient,
    private navService: NavigationService,
    private userService: UserService,
    private dialogService: DialogService) {
    this.init();
  }

  private init() {
    this.articleFilter = this.loadObject('articleFilter');
  }

  public ngOnDestroy() {
    this.saveObject('articleFilter', this.articleFilter);
  }

  private saveObject(name: string, value: any) {
    localStorage.setItem('name', JSON.stringify(value));
  }

  private loadObject(name: string): any {
    return JSON.parse(localStorage.getItem('name') || null);
  }


  // Cached lists for data selection.
  // ----------------------------------

  // Permission list.

  private _permissionList: Permission[] = [];

  public async getPermissionList(reload: boolean = false): Promise<Permission[]> {
    if (reload || !this._permissionList || this._permissionList.length === 0) {
      await this.loadPermissionList();
    }
    return this._permissionList;
  }

  public async getPermissionRefList(): Promise<PermissionRef[]> {
    if (!this._permissionList || this._permissionList.length === 0) {
      await this.loadPermissionList();
    }
    return this._permissionList.map(item => new PermissionRef(item._id, item.name));
  }

  private async loadPermissionList() {
    this._permissionList = await this.httpClient.get<Permission[]>(
      this._permissionUrl, { headers: this.userService.getHttpHeaders() })
      .pipe( map((res) => res['data']['docs'] as Permission[])).toPromise();
  }


  // Application settings.
  // ----------------------------------

  public SaveArticleFilter() {
    this.saveObject('articleFilter', this.articleFilter);
  }


}
