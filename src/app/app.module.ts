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
import { ArticlesComponent } from './components/articles/articles.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Test1Component } from './components/test1/test1.component';
import { Test1DetailComponent } from './components/test1-detail/test1-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { Test2Component } from './components/test2/test2.component';
import { Test3Component } from './components/test3/test3.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ArticleComponent } from './components/articles/article/article.component';
import { ArticleGiveawayComponent } from './components/article-giveaway/article-giveaway.component';
import { ArticleSearchComponent } from './components/article-search/article-search.component';
import {UserService} from './services/user.service';
import {DateValueAccessorDirective} from './directives/dateValueAccessor.directive';
import { EditArticleComponent } from './components/articles/edit-article/edit-article.component';
import { CreateArticleComponent } from './components/articles/create-article/create-article.component';
import { ArticleDetailsComponent } from './components/articles/article-details/article-details.component';


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
    ArticlesComponent,
    ArticleComponent,

    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    ArticleSearchComponent,
    PageNotFoundComponent,

    Test2Component,
    Test3Component,
    ArticleComponent,
    ArticleGiveawayComponent,
    DateValueAccessorDirective,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent
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
