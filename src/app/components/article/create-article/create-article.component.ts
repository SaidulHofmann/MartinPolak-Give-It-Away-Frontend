import {Component, OnInit, ViewChild} from '@angular/core';
import {EditModeType} from '../../../core/enums.core';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleItemComponent} from '../article-item/article-item.component';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import {CanDeactivate} from '@angular/router';
import {Article, UserRef} from '../../../models/index.model';
import {AuthService} from '../../permission/services/auth.service';


@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {
  public EditModeType = EditModeType;
  public article: Article;
  @ViewChild(ArticleItemComponent) private articleItemComponent: ArticleItemComponent;

  constructor(
    private authService: AuthService,
    public navService: NavigationService,
  ) { }

  public ngOnInit() {
    let article  = new Article();
    article.publisher = this.authService.currentUser as UserRef;
    this.article = article;

  }

  public canDeactivate() {
      return this.articleItemComponent ? this.articleItemComponent.canDeactivate() : true;
  }

}
