import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleBackendService} from './article-backend.service';
import {ArticleResolver} from './article-resolver.service';


describe('ArticleResolver', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ArticleResolver, ArticleBackendService]
    });
  });

  it('can be created by dependency injection', () => {
    let articleResolver = TestBed.get(ArticleResolver);
    expect(articleResolver instanceof ArticleResolver).toBe(true);
  });

});
