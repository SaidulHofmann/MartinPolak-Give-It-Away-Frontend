import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from './components/articles/articles.component';
import { CreateArticleComponent } from './components/articles/create-article/create-article.component';
import { EditArticleComponent } from './components/articles/edit-article/edit-article.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { Test1Component } from './components/test1/test1.component';
import { Test1DetailComponent } from './components/test1-detail/test1-detail.component';
import { Test2Component } from './components/test2/test2.component';
import { Test3Component } from './components/test3/test3.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ArticleDetailsComponent } from './components/articles/article-details/article-details.component';
import {ArticleResolver} from './services/article-resolver.service';

const routes = [
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/:id/details', component: ArticleDetailsComponent, resolve: { article: ArticleResolver }},
  { path: 'articles/create', component: CreateArticleComponent },
  { path: 'articles/:id/edit', component: EditArticleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'test1', component: Test1Component },
  { path: 'test1Detail/:id', component: Test1DetailComponent },
  { path: 'test2', component: Test2Component },
  { path: 'test3', component: Test3Component },
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
