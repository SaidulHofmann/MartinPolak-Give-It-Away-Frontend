import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleService} from './article.service';
import {ArticleBackendService} from './article-backend.service';
import {PagerService} from '../../shared/services/pager.service';
import {DataService} from '../../shared/services/data.service';


describe('ArticleService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ArticleService, ArticleBackendService, PagerService, DataService]
    });
  });

  it('can be created by dependency injection', () => {
    let articleService = TestBed.get(ArticleService);
    expect(articleService instanceof ArticleService).toBe(true);
  });

});
