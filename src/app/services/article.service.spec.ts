import { TestBed, inject, async, ComponentFixture } from '@angular/core/testing';
import { ArticleService } from './article.service';
import {HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import {MessageService} from '../message.service';
import { testArticleResponse, testArticleObj } from '../models/data.model';
import {defer} from 'rxjs/observable/defer';

describe('ArticleService', () => {
  let articleService: ArticleService;
  let httpClientSpy: { get: jasmine.Spy, put: jasmine.Spy, post: jasmine.Spy, delete: jasmine.Spy };
  let messageServiceSpy: jasmine.SpyObj<MessageService>;


  beforeEach(() => {
    // Create service mocks as spy objects.
    httpClientSpy = jasmine.createSpyObj(
      'HttpClient', ['get', 'put', 'post', 'delete']);
    messageServiceSpy = jasmine.createSpyObj(
      'MessageService', ['add']);

    articleService = new ArticleService(<any> httpClientSpy, messageServiceSpy);

    TestBed.configureTestingModule({
      providers: [ ArticleService, HttpClient, MessageService, HttpHandler ]
    });

  });

  it('can be created by dependency injection',
    inject([ArticleService],(service: ArticleService) => {
    expect(service instanceof ArticleService).toBe(true);
  }));

  it('#getArticleById should return an article', () => {
    httpClientSpy.get.and.returnValue(testArticleResponse);
    expect(httpClientSpy.get('url')).toBe(testArticleResponse);

    expect(articleService.getArticleById('id').subscribe(
      article => expect(article).toEqual(testArticleObj),
          error => fail('Error occurred calling getArticleById(): ' + error.message)
      )
    );
  });


  /** Create async observable that emits-once and completes
   *  after a JS engine turn */
  function asyncData<T>(data: T) {
    return defer(() => Promise.resolve(data));
  }

});
