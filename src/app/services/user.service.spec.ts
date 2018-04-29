import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClient} from '@angular/common/http';
import {MessageService} from './message.service';
import {ArticleService} from './article.service';

describe('UserService', () => {
  let userService: UserService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const httpClientSpyObj = jasmine.createSpyObj(
      'HttpClient', ['get', 'put', 'post', 'delete']);
    const messageServiceSpyObj = jasmine.createSpyObj(
      'MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpClient, useValue: httpClientSpyObj },
        { provide: MessageService, useValue: messageServiceSpyObj }
      ]
    });

    userService = TestBed.get(UserService);
    httpClientSpy = TestBed.get(HttpClient);
    messageServiceSpy = TestBed.get(MessageService);
  });

  it('should be created', () => {
    expect(userService).toBeTruthy();
  });

});
