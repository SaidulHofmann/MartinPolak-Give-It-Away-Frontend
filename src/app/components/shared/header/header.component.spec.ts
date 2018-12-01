import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import {HttpClient, HttpHandler} from '@angular/common/http';
// import {Router} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {async, ComponentFixture} from '../../../../../node_modules/@angular/core/testing';
import {AppComponent} from '../../../app.component';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let component: HeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [HeaderComponent],
      providers: [HttpClient, HttpHandler]
    });

    this.fixture = TestBed.createComponent(HeaderComponent);
    this.component = this.fixture.componentInstance;
  });

  it('can be created by dependency injection', () => {
    expect(this.component).toBeTruthy();
  });

  it(`should have as title 'Give it Away'`, async(() => {
    expect(this.component.appTitle).toEqual('Give it Away');
  }));

  it(`should have as description 'Verschenken Sie, was Sie nicht mehr brauchen !'`, async(() => {
    expect(this.component.appDescription).toEqual('Verschenken Sie, was Sie nicht mehr brauchen !');
  }));

});
