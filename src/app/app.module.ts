import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ArticleService } from './services/article.service';
import { MessageService } from './services/message.service';

import { AppComponent } from './app.component';
import { AppNavbarComponent } from './components/shared/app-navbar/app-navbar.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { AppRoutingModule } from './/app-routing.module';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { MessagesComponent } from './components/shared/messages/messages.component';
import { ArticleComponent } from './components/articles/article/article.component';
import {UserService} from './services/user.service';
import {DateValueAccessorDirective} from './directives/dateValueAccessor.directive';
import { EditArticleComponent } from './components/articles/edit-article/edit-article.component';
import { CreateArticleComponent } from './components/articles/create-article/create-article.component';
import { ArticleDetailsComponent } from './components/articles/article-details/article-details.component';
import {PagerService} from './services/pager.service';
import {ArticleResolver} from './services/article-resolver.service';
import { GiveawayArticleComponent } from './components/articles/giveaway-article/giveaway-article.component';
import { PagerComponent } from './components/shared/pager/pager.component';
import { MaterialModule } from './material.module';
import { DialogComponent } from './components/shared/dialog/dialog.component';
import { RolesComponent } from './components/users/roles/roles.component';
import { UsersComponent } from './components/users/users.component';


@NgModule({
  declarations: [
    AppComponent,
    AppNavbarComponent,
    HeaderComponent,
    FooterComponent,
    MessagesComponent,

    LoginComponent,
    RegisterComponent,
    PageNotFoundComponent,
    DateValueAccessorDirective,

    ArticlesComponent,
    ArticleComponent,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent,
    GiveawayArticleComponent,
    PagerComponent,
    DialogComponent,
    RolesComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ArticleService,
    MessageService,
    UserService,
    PagerService,
    ArticleResolver
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
