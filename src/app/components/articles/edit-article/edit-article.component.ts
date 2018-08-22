import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EditModeType} from '../../../core/enums.core';
import {Article} from '../../../models/index.model';
import {ArticleService} from '../services/article.service';


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  public article: Article;
  public EditModeType = EditModeType;

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute) { }

  public ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.articleService.getArticleById(id).subscribe(article => this.article = article);
  }

}
