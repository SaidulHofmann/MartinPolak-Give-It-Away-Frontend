import {NgModule} from '@angular/core';
import {ArticleComponent} from './article.component';
import {ArticleItemComponent} from './article-item/article-item.component';
import {EditArticleComponent} from './edit-article/edit-article.component';
import {CreateArticleComponent} from './create-article/create-article.component';
import {ArticleDetailsComponent} from './article-details/article-details.component';
import {GiveawayArticleComponent} from './giveaway-article/giveaway-article.component';
import {SharedModule} from '../shared/shared.module';
import {ArticleRoutingModule} from './article-routing.module';


@NgModule({
  imports: [
    SharedModule,
    ArticleRoutingModule
  ],
  declarations: [
    ArticleComponent,
    ArticleItemComponent,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent,
    GiveawayArticleComponent
  ],
  exports: [
    ArticleComponent,
    ArticleItemComponent,
    EditArticleComponent,
    CreateArticleComponent,
    ArticleDetailsComponent,
    GiveawayArticleComponent
  ],
  providers: [
  ]
})
export class ArticleModule { }
