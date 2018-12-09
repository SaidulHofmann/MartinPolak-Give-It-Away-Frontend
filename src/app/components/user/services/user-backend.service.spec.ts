import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {UserBackendService} from './user-backend.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';


describe('UserBackendService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [UserBackendService, { provide: AuthService, useClass: AuthServiceMock }]
    });
  });

  it('can be created by dependency injection', () => {
    let userBackendService = TestBed.get(UserBackendService);
    expect(userBackendService instanceof UserBackendService).toBe(true);
  });

});
