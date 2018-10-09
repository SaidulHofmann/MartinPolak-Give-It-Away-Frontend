import {Component, OnInit, ViewChild} from '@angular/core';
import {EditModeType} from '../../../core/enums.core';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleItemComponent} from '../article-item/article-item.component';
import {CanComponentDeactivate} from '../../permission/services/can-deactivate-guard.service';
import {CanDeactivate} from '@angular/router';


@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit, CanDeactivate<CanComponentDeactivate> {
  public EditModeType = EditModeType;
  @ViewChild(ArticleItemComponent) private articleItemComponent: ArticleItemComponent;

  constructor(
    public navService: NavigationService,
  ) { }

  public ngOnInit() {
  }

  public canDeactivate() {
      return this.articleItemComponent ? this.articleItemComponent.canDeactivate() : true;
  }

}
