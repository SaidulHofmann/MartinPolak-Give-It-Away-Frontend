import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {ArticleService} from './article.service';
import {ArticleBackendService} from './article-backend.service';
import {ArticleDetailsService} from './article-details.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';


describe('ArticleDetailsService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ArticleDetailsService,
        { provide: AuthService, useClass: AuthServiceMock },
        ArticleBackendService,
        ArticleService
      ]
    });
  });

  it('can be created by dependency injection', () => {
    let articleDetailsService = TestBed.get(ArticleDetailsService);
    expect(articleDetailsService instanceof ArticleDetailsService).toBe(true);
  });

});
