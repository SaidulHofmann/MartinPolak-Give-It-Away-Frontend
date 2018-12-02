// Contains mock classes for testing.

import {HttpHeaders} from '../../../node_modules/@angular/common/http';
import {CanDeactivate} from '@angular/router';
import {CanComponentDeactivate} from '../components/permission/services/can-deactivate-guard.service';
import {Observable} from '../../../node_modules/rxjs';

export class AuthServiceMock {
  public isAuthenticated: boolean = false;

  public getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + 'FakeToken'
    });
  }
}

export class ComponentMock implements CanDeactivate<CanComponentDeactivate> {
  public isDeactivable = false;

  public canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.isDeactivable;
  }
}
