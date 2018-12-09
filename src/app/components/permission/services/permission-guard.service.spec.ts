import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from './auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {PermissionGuard} from './permission-guard.service';
import {ArticleBackendService} from '../../article/services/article-backend.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';


describe('PermissionGuard', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        PermissionGuard,
        { provide: AuthService, useClass: AuthServiceMock },
        NavigationService,
        ArticleBackendService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let permissionGuard = TestBed.get(PermissionGuard);
    expect(permissionGuard instanceof PermissionGuard).toBe(true);
  });

});
