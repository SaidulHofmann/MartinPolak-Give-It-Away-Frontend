/* Implements UC04-Artikel anzeigen. */

import { Component, OnInit } from '@angular/core';
import {ArticleService} from '../article.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-article-overview',
  templateUrl: './article-overview.component.html',
  styleUrls: ['./article-overview.component.scss']
})
export class ArticleOverviewComponent implements OnInit {

  articles: any;
  constructor(private http: HttpClient, private service: ArticleService) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.service.getArticles().subscribe(res => {
      this.articles = res;
    });
  }

}
