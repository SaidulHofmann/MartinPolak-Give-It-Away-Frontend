import { Component, OnInit } from '@angular/core';
import {Article, HttpResponseArticles} from '../../models/article.model';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-test1',
  templateUrl: './test1.component.html',
  styleUrls: ['./test1.component.scss']
})
export class Test1Component implements OnInit {
  articles: Article[];
/*  selectedArticle: Article;*/

  constructor(private articleService: ArticleService) { }

  ngOnInit() {
    this.getArticles();
  }

/*  onSelect(article: Article): void {
    this.selectedArticle = article;
  }*/

  getArticles(): void {
    this.articleService.getArticles()
      .subscribe(res => this.articles = (res as HttpResponseArticles).data.docs);
  }

  add(name: string): void {
    name = name.trim();
    if(!name) { return; }
    this.articleService.createArticle({ name } as Article )
      .subscribe(article => {
        this.articles.push(article);
      });
  }

  delete(article: Article): void {
    this.articles = this.articles.filter(a => a !== article);
    this.articleService.deleteArticle(article).subscribe();
  }

}
