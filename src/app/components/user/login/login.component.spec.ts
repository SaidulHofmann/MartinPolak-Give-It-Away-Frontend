import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {ArticleBackendService} from '../../article/services/article-backend.service';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../core/test-mocks.core';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleService} from '../../article/services/article.service';
import {DialogService} from '../../shared/services/dialog.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {SharedModule} from '../../shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        NavigationService,
        DialogService,
        ArticleService
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('can be created by dependency injection', () => {
    expect(component).toBeTruthy();
  });
});
