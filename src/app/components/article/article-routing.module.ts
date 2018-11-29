import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ArticleComponent} from './article.component';
import {ArticleDetailsComponent} from './article-details/article-details.component';
import {ArticleResolver} from './services/article-resolver.service';
import {CreateArticleComponent} from './create-article/create-article.component';
import {EditArticleComponent} from './edit-article/edit-article.component';
import {GiveawayArticleComponent} from './giveaway-article/giveaway-article.component';
import {AuthGuard} from '../permission/services/auth-guard.service';
import {PermissionGuard} from '../permission/services/permission-guard.service';
import {CanDeactivateGuard} from '../permission/services/can-deactivate-guard.service';
import {PermissionType} from '../../core/enums.core';

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
    canActivate: [PermissionGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { acceptedPermissions: [PermissionType.articleOwnCreate] }
  },
  { path: 'articles/:id/edit',
    component: EditArticleComponent,
    canActivate: [PermissionGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { acceptedPermissions: [
      PermissionType.articleOwnUpdate,
      PermissionType.articleOtherUpdate,
      PermissionType.articleOwnDelete,
      PermissionType.articleOtherDelete
      ]}
  },
  { path: 'articles/:id/giveAway',
    component: GiveawayArticleComponent,
    canActivate: [PermissionGuard],
    resolve: { article: ArticleResolver },
    data: { acceptedPermissions: [
        PermissionType.articleOwnDonate,
        PermissionType.articleOtherDonate
      ]}
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ArticleRoutingModule { }
