/* Implements UC04-Artikel anzeigen. */

import { Component, OnInit } from '@angular/core';
import {ArticleService} from '../../services/article.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article-overview',
  templateUrl: './article-overview.component.html',
  styleUrls: ['./article-overview.component.scss']
})
export class ArticleOverviewComponent implements OnInit {

  articles: any;
  constructor(
    private http: HttpClient,
    private articleService: ArticleService) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.articleService.getArticles().subscribe(articles => {
      this.articles = articles;
    });
  }

}
