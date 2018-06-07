import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from './components/articles/articles.component';
import { CreateArticleComponent } from './components/articles/create-article/create-article.component';
import { EditArticleComponent } from './components/articles/edit-article/edit-article.component';
import { RegisterComponent } from './components/users/register/register.component';
import { LoginComponent } from './components/users/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ArticleDetailsComponent } from './components/articles/article-details/article-details.component';
import { ArticleResolver } from './services/article-resolver.service';
import { GiveawayArticleComponent } from './components/articles/giveaway-article/giveaway-article.component';
import {UsersComponent} from './components/users/users.component';
import {RolesComponent} from './components/users/roles/roles.component';

const routes = [
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/:id/details', component: ArticleDetailsComponent, resolve: { article: ArticleResolver }},
  { path: 'articles/create', component: CreateArticleComponent },
  { path: 'articles/:id/edit', component: EditArticleComponent },
  { path: 'articles/:id/giveAway', component: GiveawayArticleComponent, resolve: { article: ArticleResolver } },
  { path: 'users', component: UsersComponent },
  { path: 'users/register', component: RegisterComponent },
  { path: 'users/login', component: LoginComponent },
  { path: 'users/roles', component: RolesComponent },
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
