import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from './auth.service';
import {PermissionService} from './permission.service';
import {PermissionBackendService} from './permission-backend.service';
import {DataService} from '../../shared/services/data.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';


describe('PermissionService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        PermissionService,
        PermissionBackendService,
        DataService,
        { provide: AuthService, useClass: AuthServiceMock }
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let permissionService = TestBed.get(PermissionService);
    expect(permissionService instanceof PermissionService).toBe(true);
  });

});
