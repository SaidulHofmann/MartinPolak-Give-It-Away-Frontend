import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {AppNavbarComponent} from './components/app-navbar/app-navbar.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {MessagesComponent} from './components/messages/messages.component';
import { RouterTestingModule } from '@angular/router/testing';
import {MessageService} from './message.service';

describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, AppNavbarComponent, HeaderComponent, FooterComponent, MessagesComponent
      ],
      imports: [RouterTestingModule],
      providers: [MessageService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Give it Away'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Give it Away');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Give it Away');
  }));

});
