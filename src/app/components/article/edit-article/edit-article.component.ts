import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, CanDeactivate} from '@angular/router';
import {EditModeType} from '../../../core/enums.core';
import {Article} from '../../../models/index.model';
import {ArticleBackendService} from '../services/article-backend.service';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import {ArticleItemComponent} from '../article-item/article-item.component';
import {Subscription} from '../../../../../node_modules/rxjs';
import {AuthService} from '../../permission/services/auth.service';


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit, OnDestroy, CanDeactivate<CanComponentDeactivate> {
  public EditModeType = EditModeType;
  public editMode = EditModeType.Read;
  public article: Article;
  @ViewChild(ArticleItemComponent) private articleItemComponent: ArticleItemComponent;
  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private articleBackend: ArticleBackendService,
    private activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this. subscription = this.articleBackend.getArticleById(id).subscribe(article => {
      this.article = article;
      if (this.authService.canUpdateArticle(this.article)) {
        this.editMode = EditModeType.Update;
      } else if (this.authService.canDeleteArticle(this.article)) {
        this.editMode = EditModeType.Delete;
      } else {
        this.editMode = EditModeType.Read;
      }
    });
  }

  public ngOnDestroy() {
    this. subscription.unsubscribe();
  }

  public canDeactivate() {
    return this.articleItemComponent ? this.articleItemComponent.canDeactivate() : true;
  }
}
