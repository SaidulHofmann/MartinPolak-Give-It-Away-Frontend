import {Article} from '../../../models/article.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ArticleBackendService} from './article-backend.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleResolver implements Resolve<Article> {
  constructor(private articleBackend: ArticleBackendService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Article> | Promise<Article> | Article {
      return this.articleBackend.getArticleById(route.params.id, true);
  }
}
