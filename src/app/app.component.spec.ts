import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {AppNavbarComponent} from './components/shared/app-navbar/app-navbar.component';
import {HeaderComponent} from './components/shared/header/header.component';
import {FooterComponent} from './components/shared/footer/footer.component';
import {MessagesComponent} from './components/shared/messages/messages.component';
import { RouterTestingModule } from '@angular/router/testing';
import {MessageService} from './components/shared/services/message.service';
import {HttpClientTestingModule} from '../../node_modules/@angular/common/http/testing';


describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent, AppNavbarComponent, HeaderComponent, FooterComponent, MessagesComponent],
      providers: [
        MessageService
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('should create the app', async(() => {
    expect(component instanceof AppComponent).toBe(true);
  }));

});
