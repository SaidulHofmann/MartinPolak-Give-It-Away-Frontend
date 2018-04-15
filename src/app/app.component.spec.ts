import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {AppNavbarComponent} from './components/app-navbar/app-navbar.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {MessagesComponent} from './components/messages/messages.component';
import { RouterTestingModule } from '@angular/router/testing';
import {MessageService} from './message.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, AppNavbarComponent, HeaderComponent, FooterComponent, MessagesComponent
      ],
      imports: [RouterTestingModule],
      providers: [MessageService]
    });
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  }));

  it('should create the app', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`should have as title 'Give it Away'`, async(() => {
    expect(component.title).toEqual('Give it Away');
  }));

  it('should render title in a h1 tag', async(() => {
    fixture.detectChanges(); // performs data binding
    const h1: HTMLElement = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).toContain('Give it Away');
  }));

});
