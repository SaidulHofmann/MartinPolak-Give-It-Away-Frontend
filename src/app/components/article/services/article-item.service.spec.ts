import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleService} from './article.service';
import {ArticleBackendService} from './article-backend.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';
import {ArticleItemService} from './article-item.service';
import {DataService} from '../../shared/services/data.service';
import {PagerService} from '../../shared/services/pager.service';


describe('ArticleItemService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ArticleItemService,
        { provide: AuthService, useClass: AuthServiceMock },
        ArticleBackendService,
        ArticleService,
        PagerService,
        DataService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let articleItemService = TestBed.get(ArticleItemService);
    expect(articleItemService instanceof ArticleItemService).toBe(true);
  });

});
