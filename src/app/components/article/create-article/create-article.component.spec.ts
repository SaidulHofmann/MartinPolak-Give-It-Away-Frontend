import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CreateArticleComponent} from './create-article.component';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {SharedModule} from '../../shared/shared.module';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleItemComponent} from '../article-item/article-item.component';
import {EditModeType} from '../../../core/enums.core';


describe('CreateArticleComponent', () => {
  let fixture: ComponentFixture<CreateArticleComponent>;
  let component: CreateArticleComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [CreateArticleComponent, ArticleItemComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        NavigationService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(CreateArticleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('can be created by dependency injection', () => {
    expect(component instanceof CreateArticleComponent).toBe(true);
  });

  it('#editMode should be EditModeType.Create', () => {
    expect(component.editMode).toBe(EditModeType.Create);
  });

  it('#article.publisher should be set to currentUser', () => {
    let authService = TestBed.get(AuthService);
    expect(component.article.publisher._id).toBe(authService.currentUser._id);
  });

});
