import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClient} from '@angular/common/http';
import {MessageService} from '../../shared/services/message.service';
import {ArticleService} from '../../article/services/article.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {UserBackendService} from './user-backend.service';
import {DataService} from '../../shared/services/data.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';

describe('UserService', () => {
  beforeEach(() => {
    const httpClientSpyObj = jasmine.createSpyObj(
      'HttpClient', ['get', 'put', 'post', 'delete']);
    const messageServiceSpyObj = jasmine.createSpyObj(
      'MessageService', ['add']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        UserService,
        UserBackendService,
        DataService,
        {provide: AuthService, useClass: AuthServiceMock}
      ]
    });

  });

  it('can be created by dependency injection', () => {
    let userService = new UserService(TestBed.get(UserBackendService), TestBed.get(DataService));
    expect(userService).toBeTruthy();
  });

});
