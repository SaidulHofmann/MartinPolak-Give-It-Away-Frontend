import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArticleService } from './services/article.service';
import { MessageService } from './message.service';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './components/app-navbar/app-navbar.component';
import { ArticleOverviewComponent } from './containers/article-overview/article-overview.component';
import { AppRoutingModule } from './/app-routing.module';
import { ArticleNewComponent } from './containers/article-new/article-new.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { Test1Component } from './containers/test1/test1.component';
import { Test1DetailComponent } from './containers/test1-detail/test1-detail.component';
import { RegisterComponent } from './containers/register/register.component';
import { LoginComponent } from './containers/login/login.component';
import { Test2Component } from './containers/test2/test2.component';
import { Test3Component } from './containers/test3/test3.component';
import { PageNotFoundComponent } from './containers/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ArticleEditComponent } from './containers/article-edit/article-edit.component';
import { ArticleGiveawayComponent } from './containers/article-giveaway/article-giveaway.component';
import { ArticleDetailComponent } from './containers/article-detail/article-detail.component';
import { ArticleSearchComponent } from './containers/article-search/article-search.component';
import {UserService} from './services/user.service';
import {DateValueAccessorDirective} from './shared/dateValueAccessor.directive';


@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,

    Test1Component,
    Test1DetailComponent,
    MessagesComponent,
    ArticleOverviewComponent,
    ArticleNewComponent,

    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ArticleSearchComponent,
    PageNotFoundComponent,

    Test2Component,
    Test3Component,
    ArticleDetailComponent,
    ArticleEditComponent,
    ArticleGiveawayComponent,
    DateValueAccessorDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,

    // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    // HttpClientInMemoryWebApiModule.forRoot(
    //  InMemoryDataService, { dataEncapsulation: false }
    // )
  ],
  providers: [ ArticleService, MessageService, UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
