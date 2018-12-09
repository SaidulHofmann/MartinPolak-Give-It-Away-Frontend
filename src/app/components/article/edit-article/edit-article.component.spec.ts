import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {SharedModule} from '../../shared/shared.module';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';
import {ArticleItemComponent} from '../article-item/article-item.component';
import {EditModeType} from '../../../core/enums.core';
import {EditArticleComponent} from './edit-article.component';
import {ArticleBackendService} from '../services/article-backend.service';


describe('EditArticleComponent', () => {
  let fixture: ComponentFixture<EditArticleComponent>;
  let component: EditArticleComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [EditArticleComponent, ArticleItemComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        ArticleBackendService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EditArticleComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('can be created by dependency injection', () => {
    expect(component instanceof EditArticleComponent).toBe(true);
  });

  it('#editMode should be \'read\' if nothing assigned', () => {
    expect(component.editMode).toBe(EditModeType.Read);
  });

});
