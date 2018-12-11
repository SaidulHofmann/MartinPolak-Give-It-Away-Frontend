import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {UserBackendService} from './user-backend.service';
import {DataService} from '../../shared/services/data.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';

describe('UserService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        UserService,
        UserBackendService,
        DataService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let userService = TestBed.get(UserService);
    expect(userService instanceof UserService).toBe(true);
  });

});
