import {Injectable} from '@angular/core';
import {Permission, PermissionRef} from '../../../models/permission.model';
import {map} from 'rxjs/operators';
import {NavigationService} from './navigation.service';
import {HttpClient} from '@angular/common/http';
import {IdNamePair} from '../../../core/types.core';
import {ArticleCategory, ArticleStatus} from '../../../models/index.model';
import {AuthService} from '../../permission/services/auth.service';


/**
 * Provides lists, cached data and support for persistency.
 */
@Injectable({ providedIn: 'root' })
export class LocalDataService {
  // tslint:disable:member-ordering

  // Constants, variables, properties
  // ----------------------------------
  private _api_url = 'http://localhost:3003';
  private _permissionUrl = `${this._api_url}/api/permissions`;
  private _articleCategoryUrl = `${this._api_url}/api/articleCategories`;
  private _articleStatusUrl = `${this._api_url}/api/articleStatus`;


  // Methods
  // ----------------------------------
  constructor(
    private authService: AuthService,
    private navService: NavigationService,
    private http: HttpClient) {

    this.preloadCachedData();
  }

  private async preloadCachedData(): Promise<void> {
    try {
      await this.getPermissionListAsync();
      await this.getArticleCategoryListAsync();
      await this.getArticleCategoryFilterAsync();
      await this.getArticleStatusListAsync();
      await this.getArticleStatusFilterAsync();
    } catch(ex) {
      throw ex;
    }
  }


  // Persistency
  // -----------------------------------------------

  public saveObject(name: string, value: any) {
    localStorage.setItem(name, JSON.stringify(value));
  }

  public loadObject(name: string): any {
    return JSON.parse(localStorage.getItem(name) || null);
  }


  // Cached lists for data selection in UI controls.
  // -----------------------------------------------

  // Permission list.

  private _permissionList: Permission[] = [];

  public async getPermissionListAsync(reload: boolean = false): Promise<Permission[]> {
    if (reload || !this._permissionList || this._permissionList.length === 0) {
      await this.loadPermissionListAsync();
    }
    return this._permissionList;
  }

  public async getPermissionRefListAsync(): Promise<PermissionRef[]> {
    if (!this._permissionList || this._permissionList.length === 0) {
      await this.loadPermissionListAsync();
    }
    return this._permissionList.map(item => new PermissionRef(item._id, item.name));
  }

  private async loadPermissionListAsync(): Promise<void> {
    this._permissionList = await this.http.get<Permission[]>(
      this._permissionUrl, { headers: this.authService.getHttpHeaders() })
      .pipe( map((res) => res['data']['docs'] as Permission[])).toPromise();
  }

  // ArticleCategories

  private _articleCategoryList: ArticleCategory[] = [];
  private _articleCategoryFilter: ArticleCategory[] = [];

  public async getArticleCategoryListAsync(reload: boolean = false): Promise<ArticleCategory[]> {
    if (reload || !this._articleCategoryList || this._articleCategoryList.length === 0) {
      this._articleCategoryList = await this.loadArticleCategoryListAsync();
    }
    return this._articleCategoryList;
  }

  public async getArticleCategoryFilterAsync(reload: boolean = false): Promise<ArticleCategory[]> {
    if (reload || !this._articleCategoryFilter || this._articleCategoryFilter.length === 0) {
      this._articleCategoryFilter = await this.loadArticleCategoryListAsync();
      this._articleCategoryFilter.unshift({_id: 'undefined', name: 'Alle Kategorien'});
    }
    return this._articleCategoryFilter;
  }

  private async loadArticleCategoryListAsync(): Promise<ArticleCategory[]> {
    return this.http.get<ArticleCategory[]>(
      this._articleCategoryUrl, { headers: this.authService.getHttpHeaders() })
      .pipe( map((res) => res['data']['docs'] as ArticleCategory[])).toPromise();
  }

  // ArticleStatus

  private _articleStatusList: ArticleStatus[] = [];
  private _articleStatusFilter: ArticleStatus[] = [];

  public async getArticleStatusListAsync(reload: boolean = false): Promise<ArticleStatus[]> {
    if (reload || !this._articleStatusList || this._articleStatusList.length === 0) {
      this._articleStatusList = await this.loadArticleStatusListAsync();
    }
    return this._articleStatusList;
  }

  public async getArticleStatusFilterAsync(reload: boolean = false): Promise<ArticleStatus[]> {
    if (reload || !this._articleStatusFilter || this._articleStatusFilter.length === 0) {
      this._articleStatusFilter = await this.loadArticleStatusListAsync();
      this._articleStatusFilter.unshift({_id: 'undefined', name: 'Alle Artikel Status'});
    }
    return this._articleStatusFilter;
  }

  private async loadArticleStatusListAsync(): Promise<ArticleStatus[]> {
    return this.http.get<ArticleStatus[]>( this._articleStatusUrl, { headers: this.authService.getHttpHeaders() })
      .pipe( map((res) => res['data']['docs'] as ArticleStatus[])).toPromise();
  }

  // Article sort options.

  private _articleSortOptions: IdNamePair[] = [
    { _id: 'undefined', name: 'Keine Sortierung' },
    { _id: 'name', name: 'Artikelbezeichnung aufst. ▲'},
    { _id: '-name', name: 'Artikelbezeichnung abst. ▼' },
    { _id: 'createdAt', name: 'Erstellungsdatum aufst. ▲' },
    { _id: '-createdAt', name: 'Erstellungsdatum abst. ▼' },
    { _id: 'donationDate', name: 'Schenkungsdatum aufst. ▲' },
    { _id: '-donationDate', name: 'Schenkungsdatum abst. ▼' }
  ];

  public getArticleSortOptions(): IdNamePair[] {
    return this._articleSortOptions;
  }


}
