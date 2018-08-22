import {NgModule} from '@angular/core';
import {ArticlesComponent} from './articles.component';
import {ArticleComponent} from './article-item/article.component';
import {EditArticleComponent} from './edit-article/edit-article.component';
import {CreateArticleComponent} from './create-article/create-article.component';
import {ArticleDetailsComponent} from './article-details/article-details.component';
import {GiveawayArticleComponent} from './giveaway-article/giveaway-article.component';
import {SharedModule} from '../shared/shared.module';
import {ArticlesRoutingModule} from './articles-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ArticlesRoutingModule
  ],
  declarations: [
    ArticlesComponent,
    ArticleComponent,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent,
    GiveawayArticleComponent
  ],
  exports: [
    ArticlesComponent,
    ArticleComponent,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent,
    GiveawayArticleComponent
  ],
  providers: [
  ]
})
export class ArticlesModule { }
