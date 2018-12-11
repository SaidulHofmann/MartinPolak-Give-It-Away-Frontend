import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from './auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {AuthGuard} from './auth-guard.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';


describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        {provide: AuthService, useClass: AuthServiceMock},
        AuthGuard,
        NavigationService
      ]
    });
    this.authGuard = TestBed.get(AuthGuard);
    this.authService = TestBed.get(AuthService);
  });

  it('can be created by dependency injection', () => {
    expect(this.authGuard instanceof AuthGuard).toBe(true);
  });

  it('should activate if logged in', () => {
    this.authService.isAuthenticated = true;
    expect(this.authGuard.canActivate()).toBe(true);
  });

  it('should not activate if not logged in', () => {
    let navigationService = TestBed.get(NavigationService);
    spyOn(navigationService, 'gotoLoginPage');

    this.authService.isAuthenticated = false;

    expect(this.authGuard.canActivate()).toBe(false);
    expect(navigationService.gotoLoginPage).toHaveBeenCalled();
  });

});
