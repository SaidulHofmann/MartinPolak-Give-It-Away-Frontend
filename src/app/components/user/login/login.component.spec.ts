import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import {AuthService} from '../../permission/services/auth.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleService} from '../../article/services/article.service';
import {DialogService} from '../../shared/services/dialog.service';
import {RouterTestingModule} from '../../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {SharedModule} from '../../shared/shared.module';
import {AuthServiceMock} from '../../../../testing/mocks.test';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [LoginComponent],
      providers: [
        {provide: AuthService, useClass: AuthServiceMock},
        NavigationService,
        DialogService,
        ArticleService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      fixture.detectChanges();
      component = fixture.componentInstance;
    });
  }));

  it('can be created by dependency injection', () => {
    expect(component instanceof LoginComponent).toBe(true);
  });
});
