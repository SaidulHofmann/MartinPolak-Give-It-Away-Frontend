import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticleOverviewComponent } from './containers/article-overview/article-overview.component';
import { ArticleNewComponent } from './containers/article-new/article-new.component';
import { RegisterComponent } from './containers/register/register.component';
import { LoginComponent } from './containers/login/login.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { Test1Component } from './containers/test1/test1.component';
import { Test1DetailComponent } from './containers/test1-detail/test1-detail.component';
import { Test2Component } from './containers/test2/test2.component';
import { Test3Component } from './containers/test3/test3.component';
import { PageNotFoundComponent } from './containers/page-not-found/page-not-found.component';
import { ArticleDetailComponent } from './containers/article-detail/article-detail.component';

const routes = [
  { path: 'articleOverview', component: ArticleOverviewComponent },
  { path: 'detail/:id', component: ArticleDetailComponent },
  { path: 'test1Detail/:id', component: Test1DetailComponent },
  { path: 'articleNew', component: ArticleNewComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
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
