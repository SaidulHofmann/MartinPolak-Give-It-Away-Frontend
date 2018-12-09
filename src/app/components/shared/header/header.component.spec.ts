import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import {async, ComponentFixture} from '../../../../../node_modules/@angular/core/testing';
import {HttpClientTestingModule} from '../../../../../node_modules/@angular/common/http/testing';
import {AuthService} from '../../permission/services/auth.service';
import {AuthServiceMock} from '../../../../testing/mocks.test';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock }
      ]
    }).compileComponents().then(() => {
      this.fixture = TestBed.createComponent(HeaderComponent);
      this.component = this.fixture.componentInstance;
      this.fixture.detectChanges();
    });
  }));

  it('can be created by dependency injection', () => {
    expect(this.component instanceof HeaderComponent).toBe(true);
  });

  it(`should have as title 'Give it Away'`, () => {
    expect(this.component.appTitle).toEqual('Give it Away');
  });

  it(`should have as description 'Verschenken Sie, was Sie nicht mehr brauchen !'`, () => {
    expect(this.component.appDescription).toEqual('Verschenken Sie, was Sie nicht mehr brauchen !');
  });

});
