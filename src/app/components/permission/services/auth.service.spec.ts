import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from './auth.service';
import {NavigationService} from '../../shared/services/navigation.service';


describe('AuthService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthService, NavigationService]
    });
  });

  it('can be created by dependency injection', () => {
    let authService = TestBed.get(AuthService);
    expect(authService instanceof AuthService).toBe(true);
  });

});
