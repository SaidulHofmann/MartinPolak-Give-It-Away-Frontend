import {TestBed} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {HttpClient, HttpErrorResponse } from '@angular/common/http';
import {of} from '../../../../../node_modules/rxjs';
import {ArticleBackendService} from './article-backend.service';
import {AuthService} from '../../permission/services/auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {Article} from '../../../models/article.model';
import {fail} from 'assert';
import {AuthServiceMock} from '../../../core/test-mocks.core';

const testArticleId = '5a9e4e65bdd7751e5033123f';

describe('ArticleBackendService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ArticleBackendService,
        { provide: AuthService, useClass: AuthServiceMock },
        NavigationService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let articleBackendSvc = new ArticleBackendService(
      TestBed.get(AuthService),
      TestBed.get(NavigationService),
      TestBed.get(HttpClient)
    );
    expect(articleBackendSvc instanceof ArticleBackendService).toBe(true);
  });

  it('#getArticleById() should return an article', (done: DoneFn) => {
    // Arrange
    const articleStub = new Article();
    articleStub._id = testArticleId;
    const httpResponseStub = {status: 200, data: articleStub, message: 'Der Artikel wurde erfolgreich geladen.'};
    let httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    httpClientSpy.get.and.returnValue(of(httpResponseStub));

    let articleBackendSvc = new ArticleBackendService(TestBed.get(AuthService), TestBed.get(NavigationService), httpClientSpy);

    // Act
    articleBackendSvc.getArticleById(testArticleId).subscribe(
      (response: Article) => {
        // Assert
        expect(response).toBe(articleStub, 'Service returned stub value.');
        expect(httpClientSpy.get.calls.count()).toBe(1, 'HttpClientSpy was called once.');
        httpClientSpy.get.calls.mostRecent().returnValue.subscribe((returnValue) => {
          expect(returnValue).toBe(httpResponseStub, 'HttpClientSpy returned stub value.');
        });
        done();
      },
      (error: HttpErrorResponse) => fail('Error loading article: ' + error.message)
    );

  });

});
