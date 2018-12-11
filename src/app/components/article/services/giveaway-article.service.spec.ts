import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleService} from './article.service';
import {ArticleBackendService} from './article-backend.service';
import {GiveawayArticleService} from './giveaway-article.service';
import {PagerService} from '../../shared/services/pager.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';


describe('GiveawayArticleService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        GiveawayArticleService,
        ArticleBackendService,
        ArticleService,
        PagerService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let giveawayArticleService = TestBed.get(GiveawayArticleService);
    expect(giveawayArticleService instanceof GiveawayArticleService).toBe(true);
  });

});
