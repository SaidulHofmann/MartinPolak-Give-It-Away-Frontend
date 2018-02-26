import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { FormsModule } from '@angular/forms';
import { ArticleService } from './article.service';
import { MessageService } from './message.service';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { ArticleOverviewComponent } from './article-overview/article-overview.component';
import { AppRoutingModule } from './/app-routing.module';
import { ArticleNewComponent } from './article-new/article-new.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Test1Component } from './test1/test1.component';
import { Test1DetailComponent } from './test1-detail/test1-detail.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { Test2Component } from './test2/test2.component';
import { Test3Component } from './test3/test3.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { MessagesComponent } from './messages/messages.component';
import { ArticleEditComponent } from './article-edit/article-edit.component';
import { ArticleGiveawayComponent } from './article-giveaway/article-giveaway.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleSearchComponent } from './article-search/article-search.component';
import {UserService} from './_services/user.service';


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
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
