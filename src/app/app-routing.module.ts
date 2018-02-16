import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleOverviewComponent } from './article-overview/article-overview.component';
import { ArticleNewComponent } from './article-new/article-new.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { Test1Component } from './test1/test1.component';
import { Test2Component } from './test2/test2.component';
import { Test3Component } from './test3/test3.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

const routes = [
  { path: 'articleOverview', component: ArticleOverviewComponent },
  { path: 'detail/:id', component: ArticleDetailComponent },
  { path: 'articleNew', component: ArticleNewComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'test1', component: Test1Component },
  { path: 'test2', component: Test2Component },
  { path: 'test3', component: Test3Component },
  { path: '', redirectTo: '/articleOverview', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
