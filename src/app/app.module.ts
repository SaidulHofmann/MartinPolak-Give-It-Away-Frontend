import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './app-navbar/app-navbar.component';
import { ArticleOverviewComponent } from './article-overview/article-overview.component';
import { AppRoutingModule } from './/app-routing.module';
import { ArticleNewComponent } from './article-new/article-new.component';
import { Test1Component } from './test1/test1.component';
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


@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    ArticleOverviewComponent,
    ArticleNewComponent,
    Test1Component,
    RegisterComponent,
    LoginComponent,
    Test2Component,
    Test3Component,
    PageNotFoundComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    MessagesComponent,
    ArticleDetailComponent,
    ArticleEditComponent,
    ArticleGiveawayComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
