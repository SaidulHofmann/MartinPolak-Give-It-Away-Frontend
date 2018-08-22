import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticlesComponent} from './articles.component';
import {ArticleDetailsComponent} from './article-details/article-details.component';
import {ArticleResolver} from './services/article-resolver.service';
import {CreateArticleComponent} from './create-article/create-article.component';
import {EditArticleComponent} from './edit-article/edit-article.component';
import {GiveawayArticleComponent} from './giveaway-article/giveaway-article.component';

const routes: Routes = [
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/:id/details', component: ArticleDetailsComponent, resolve: { article: ArticleResolver }},
  { path: 'articles/create', component: CreateArticleComponent },
  { path: 'articles/:id/edit', component: EditArticleComponent },
  { path: 'articles/:id/giveAway', component: GiveawayArticleComponent, resolve: { article: ArticleResolver } }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ArticlesRoutingModule { }
