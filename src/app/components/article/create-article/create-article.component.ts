import {Component, OnInit, ViewChild} from '@angular/core';
import {DialogResultType, EditModeType} from '../../../core/enums.core';
import {UserService} from '../../user/services/user.service';
import {NavigationService} from '../../shared/services/navigation.service';
import {ArticleItemComponent} from '../article-item/article-item.component';
import {CanComponentDeactivate} from '../../shared/services/can-deactivate-guard.service';
import {CanDeactivate} from '@angular/router';
import {Observable} from 'rxjs/index';
import {DialogService} from '../../shared/services/dialog.service';

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
    public userService: UserService,
    private dialogService: DialogService
  ) { }

  public ngOnInit() {
  }

  public canDeactivate() {
      return this.articleItemComponent ? this.articleItemComponent.canDeactivate() : true;
  }

}
