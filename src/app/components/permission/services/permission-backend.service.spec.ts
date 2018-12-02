import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from './auth.service';
import {PermissionBackendService} from './permission-backend.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';


describe('PermissionBackendService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PermissionBackendService, {provide: AuthService, useClass: AuthServiceMock}]
    });
  });

  it('can be created by dependency injection', () => {
    let permissionBackendService = TestBed.get(PermissionBackendService);
    expect(permissionBackendService instanceof PermissionBackendService).toBe(true);
  });

});
