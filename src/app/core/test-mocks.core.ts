// Contains mock classes for testing.

import {HttpHeaders} from '../../../node_modules/@angular/common/http';

export class AuthServiceMock {
  public getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + 'FakeToken'
    });
  }
}
