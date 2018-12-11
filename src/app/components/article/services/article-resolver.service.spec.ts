import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleBackendService} from './article-backend.service';
import {ArticleResolver} from './article-resolver.service';
import {RouterStateSnapshot} from '@angular/router';
import {Article} from '../../../models/article.model';
import {of} from '../../../../../node_modules/rxjs';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';

const testArticleId = '5b35430567dfb9160c2532bf';

describe('ArticleResolver', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ArticleResolver,
        ArticleBackendService,
        { provide: AuthService, useClass: AuthServiceMock },
        {
          provide: RouterStateSnapshot, useValue: { params: of({ id: testArticleId }) }
        }
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let articleResolver = TestBed.get(ArticleResolver);
    expect(articleResolver instanceof ArticleResolver).toBe(true);
  });

  it('#resolve() should call #articleBackend.getArticleById() for articleId in Url', () => {
    let articleStub = new Article();
    articleStub._id = testArticleId;

    let articleBackendServiceSpy = jasmine.createSpyObj('ArticleBackendService', ['getArticleById']);
    articleBackendServiceSpy.getArticleById.and.returnValue(articleStub);
    let routerStateSnapshotSpy = jasmine.createSpyObj('RouterStateSnapshot', ['toString']);

    let articleResolver = TestBed.get(ArticleResolver);
    articleResolver.resolve(TestBed.get(RouterStateSnapshot), routerStateSnapshotSpy).subscribe((result: Article) => {
      expect(result).toBe(articleStub);
      expect(articleBackendServiceSpy.getArticleById.calls.mostRecent).toHaveBeenCalledWith(testArticleId, true);
    });
  });

});
