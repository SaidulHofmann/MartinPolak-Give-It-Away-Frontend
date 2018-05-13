import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArticleService } from './services/article.service';
import { MessageService } from './services/message.service';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './components/app-navbar/app-navbar.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { AppRoutingModule } from './/app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Test1Component } from './components/test1/test1.component';
import { Test1DetailComponent } from './components/test1-detail/test1-detail.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ArticleComponent } from './components/articles/article/article.component';
import { ArticleSearchComponent } from './components/article-search/article-search.component';
import {UserService} from './services/user.service';
import {DateValueAccessorDirective} from './directives/dateValueAccessor.directive';
import { EditArticleComponent } from './components/articles/edit-article/edit-article.component';
import { CreateArticleComponent } from './components/articles/create-article/create-article.component';
import { ArticleDetailsComponent } from './components/articles/article-details/article-details.component';
import {PagerService} from './services/pager.service';
import {ArticleResolver} from './services/article-resolver.service';
import { GiveawayArticleComponent } from './components/articles/giveaway-article/giveaway-article.component';

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

    ArticleComponent,
    DateValueAccessorDirective,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent,
    GiveawayArticleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ ArticleService, MessageService, UserService, PagerService, ArticleResolver ],
  bootstrap: [AppComponent]
})
export class AppModule { }
