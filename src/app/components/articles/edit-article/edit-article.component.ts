import { Component, OnInit } from '@angular/core';
import {Article, EditModeEnum} from '../../../models/index.model';
import {ArticleService} from '../../../services/article.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  article: Article;

  get editModeEnum() { return EditModeEnum; }

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.articleService.getArticleById(id).subscribe(article => this.article = article);
  }

}
