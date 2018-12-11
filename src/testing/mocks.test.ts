// Contains mock classes for testing.

import {CanDeactivate} from '@angular/router';
import {HttpHeaders} from '@angular/common/http';
import {CanComponentDeactivate} from '../app/components/permission/services/can-deactivate-guard.service';
import {Observable} from '../../node_modules/rxjs/index';
import {ArticleCategory, ArticleStatus, Permission, testPermissionStandardbenutzer, User} from '../app/models/index.model';
import {IdNamePair} from '../app/core/types.core';

export class AuthServiceMock {
  public isAuthenticated: boolean = false;
  public get currentUser(): User {
    let testUser = new User();
    testUser.firstname = 'Hans';
    testUser.lastname = 'Muster';
    testUser.fullname = 'Hans Muster';
    testUser.permission = testPermissionStandardbenutzer;
    testUser._id = '1234567890';
    return testUser;
  }

  public getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + 'FakeToken'
    });
  }
}

export class DataServiceMock {
  public async getArticleCategoryFilterAsync(reload: boolean = false): Promise<ArticleCategory[]> {
    return new Array<ArticleCategory>();
  }

  public async getArticleStatusFilterAsync(reload: boolean = false): Promise<ArticleStatus[]> {
    return new Array<ArticleStatus>();
  }

  public getArticleSortOptions(): IdNamePair[] {
    return new Array<IdNamePair>();
  }

  public async preloadCachedDataAsync(): Promise<void> {
    return null;
  }
}

export class ComponentMock implements CanDeactivate<CanComponentDeactivate> {
  public isDeactivable = false;

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isDeactivable;
  }
}
