import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, CanDeactivate} from '@angular/router';
import {EditModeType} from '../../../core/enums.core';
import {Article} from '../../../models/index.model';
import {ArticleService} from '../services/article.service';
import {ArticleBackendService} from '../services/article-backend.service';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import {ArticleItemComponent} from '../article-item/article-item.component';


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {
  public article: Article;
  public EditModeType = EditModeType;
  @ViewChild(ArticleItemComponent) private articleItemComponent: ArticleItemComponent;

  constructor(
    private articleBackend: ArticleBackendService,
    private activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.articleBackend.getArticleById(id).subscribe(article => this.article = article);
  }

  public canDeactivate() {
    return this.articleItemComponent ? this.articleItemComponent.canDeactivate() : true;
  }
}
