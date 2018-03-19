// Implements UC04-Artikel anzeigen.

import { Component, OnInit } from '@angular/core';
import {ArticleService} from '../../services/article.service';
import { HttpClient } from '@angular/common/http';
import {Article} from '../../models/article.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];

  constructor(
    private http: HttpClient,
    private articleService: ArticleService,
    private router: Router) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.articleService.getArticles().subscribe(articles => {
      this.articles = articles;
    });
  }

  onDetails(article: Article) {
    this.router.navigate([`/articles/${article._id}/details`]);
  }

  onEdit(article: Article) {
    this.router.navigate([`/articles/${article._id}/edit`]);
  }

}
