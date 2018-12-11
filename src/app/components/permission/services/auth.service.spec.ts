import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from './auth.service';
import {NavigationService} from '../../shared/services/navigation.service';


describe('AuthService', () => {
  let authService;
  let navigationService: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthService, NavigationService]

    });
    authService = TestBed.get(AuthService);
    navigationService = TestBed.get(NavigationService);
    spyOn(navigationService, 'gotoLoginPage');
  });

  it('can be created by dependency injection', () => {
    expect(authService instanceof AuthService).toBe(true);
  });

  it('#isAuthenticated should return false after #logout()', () => {
    authService.logout();
    expect(authService.isAuthenticated).toBe(false);
  });

  it('#logout() should set #currentUser to null', () => {
    authService.logout();
    expect(authService.currentUser).toBe(null);
  });

  it('#logout() should redirect to login page', () => {
    authService.logout();
    expect(navigationService.gotoLoginPage).toHaveBeenCalled();
  });

});
