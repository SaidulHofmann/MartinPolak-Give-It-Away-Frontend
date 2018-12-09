import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleService} from './article.service';
import {ArticleBackendService} from './article-backend.service';
import {AuthService} from '../../permission/services/auth.service';
import {ArticleItemService} from './article-item.service';
import {DataService} from '../../shared/services/data.service';
import {PagerService} from '../../shared/services/pager.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';
import {EditModeType} from '../../../core/enums.core';


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

  it('#editMode should be "read" after creation', () => {
    let articleItemService = TestBed.get(ArticleItemService);
    expect(articleItemService.editMode).toBe(EditModeType.Read);
  });

  it('#article should be in reset state after creation', () => {
    let authService = TestBed.get(AuthService);
    let articleItemService = TestBed.get(ArticleItemService);
    expect(articleItemService.article).toBeDefined();
    expect(articleItemService.article.publisher._id).toBe(authService.currentUser._id);
  });

});
