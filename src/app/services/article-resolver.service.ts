import {Article} from '../models/article.model';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {ArticleService} from './article.service';

@Injectable()
export class ArticleResolver implements Resolve<Article> {
  constructor(private articleService: ArticleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Article> | Promise<Article> | Article {
      return this.articleService.getArticleById(route.params.id);
  }
}
