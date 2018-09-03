import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticleComponent} from './article.component';
import {ArticleDetailsComponent} from './article-details/article-details.component';
import {ArticleResolver} from './services/article-resolver.service';
import {CreateArticleComponent} from './create-article/create-article.component';
import {EditArticleComponent} from './edit-article/edit-article.component';
import {GiveawayArticleComponent} from './giveaway-article/giveaway-article.component';
import {AuthGuard} from '../user/services/auth-guard.service';
import {CanDeactivateGuard} from '../shared/services/can-deactivate-guard.service';

const routes: Routes = [
  { path: 'articles',
    component: ArticleComponent,
    canActivate: [AuthGuard]
  },
  { path: 'articles/:id/details',
    component: ArticleDetailsComponent,
    canActivate: [AuthGuard],
    resolve: { article: ArticleResolver }
  },
  { path: 'articles/create',
    component: CreateArticleComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  { path: 'articles/:id/edit',
    component: EditArticleComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  { path: 'articles/:id/giveAway',
    component: GiveawayArticleComponent,
    canActivate: [AuthGuard],
    resolve: { article: ArticleResolver }
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ArticleRoutingModule { }
