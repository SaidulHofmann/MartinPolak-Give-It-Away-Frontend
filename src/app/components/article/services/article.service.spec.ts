import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleService} from './article.service';
import {ArticleBackendService} from './article-backend.service';
import {PagerService} from '../../shared/services/pager.service';
import {DataService} from '../../shared/services/data.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock, DataServiceMock} from '../../../../testing/mocks.test';


describe('ArticleService', () => {
  let articleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: DataService, useClass: DataServiceMock },
        ArticleService,
        ArticleBackendService,
        PagerService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    articleService = TestBed.get(ArticleService);
    expect(articleService instanceof ArticleService).toBe(true);
  });

  it('#initAsync() should call #loadArticlesAsync()', async(() => {
    articleService = TestBed.get(ArticleService);
    const loadArticlesAsyncSpy = spyOn(articleService, 'loadArticlesAsync').and.callThrough();

    articleService.initAsync()
      .then(() =>
        expect(loadArticlesAsyncSpy.calls.any).toBe(true, 'ArticleService.loadArticlesAsync() was called'))
      .catch(() => fail('articleService.initAsync() failed'));
  }));

  it('#initAsync() should load selection lists', async(() => {
    articleService = TestBed.get(ArticleService);
    let dataService = TestBed.get(DataService);

    spyOn(dataService, 'getArticleCategoryFilterAsync').and.callThrough();
    spyOn(dataService, 'getArticleStatusFilterAsync').and.callThrough();
    spyOn(dataService, 'getArticleSortOptions').and.callThrough();

    articleService.initAsync()
      .then(() => {
         expect(dataService.getArticleCategoryFilterAsync.calls.count).toBe(1,
           'dataService.getArticleCategoryFilterAsync was called');
         expect(dataService.getArticleStatusFilterAsync.calls.count).toBe(1,
           'dataService.getArticleStatusFilterAsync was called');
         expect(dataService.getArticleSortOptions.calls.count).toBe(1,
           'dataService.getArticleSortOptions was called');
      })
      .catch(() => fail('articleService.initAsync() failed'));
  }));

});
