import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ArticleComponent} from './article.component';
import {RouterTestingModule} from '../../../../node_modules/@angular/router/testing';
import {HttpClientTestingModule} from '../../../../node_modules/@angular/common/http/testing';
import {SharedModule} from '../shared/shared.module';
import {ArticleService} from './services/article.service';
import {AuthService} from '../permission/services/auth.service';
import {AuthServiceMock, DataServiceMock} from '../../../testing/mocks.test';
import {DataService} from '../shared/services/data.service';
import {ArticleBackendService} from './services/article-backend.service';
import {PagerService} from '../shared/services/pager.service';
import {NavigationService} from '../shared/services/navigation.service';


describe('ArticleComponent', () => {
  let fixture: ComponentFixture<ArticleComponent>;
  let component: ArticleComponent;
  let hostElements: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, SharedModule],
      declarations: [ArticleComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: DataService, useClass: DataServiceMock },
        ArticleService,
        ArticleBackendService,
        PagerService,
        NavigationService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(ArticleComponent);
      component = fixture.componentInstance;
      hostElements = fixture.nativeElement;
      fixture.detectChanges();
    });

  }));

  it('can be created by dependency injection', () => {
    expect(component instanceof ArticleComponent).toBe(true);
  });

  it('click on filterButton calls #onSetFilter()', () => {
    spyOn(component, 'onSetFilter').and.callThrough();
    let filterButton: HTMLButtonElement = hostElements.querySelector('#filterButton');
    expect(filterButton).toBeDefined('#filterButton exists.');

    filterButton.click();
    fixture.detectChanges();

    expect(component.onSetFilter).toHaveBeenCalled();
  });

  it('click on resetButton calls #onResetFilter()', () => {
    spyOn(component, 'onResetFilter').and.callThrough();
    let resetButton: HTMLButtonElement = hostElements.querySelector('#resetButton');
    expect(resetButton).toBeDefined('#resetButton exists.');

    resetButton.click();
    fixture.detectChanges();

    expect(component.onResetFilter).toHaveBeenCalled();
  });

});
