import { Component, OnInit } from '@angular/core';
import {Article, HttpResponseArticles} from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles(): void {
    this.articleService.getArticles()
      .subscribe(res => this.articles = ((res as HttpResponseArticles).data.docs).slice(1, 5));
  }
}
