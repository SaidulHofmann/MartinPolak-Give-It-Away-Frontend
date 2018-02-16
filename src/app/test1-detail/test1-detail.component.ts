import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-test1-detail',
  templateUrl: './test1-detail.component.html',
  styleUrls: ['./test1-detail.component.scss']
})
export class Test1DetailComponent implements OnInit {

  @Input() article: Article;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getArticle();
  }

  getArticle(): void {
    const id = +this.activatedRoute.snapshot.paramMap.get('id');
    this.articleService.getArticle(id)
      .subscribe(article => this.article = article);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.articleService.updateArticle(this.article)
      .subscribe(() => this.goBack());
  }

}
