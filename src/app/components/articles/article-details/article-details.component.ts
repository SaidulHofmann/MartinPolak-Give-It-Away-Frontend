import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Data} from '@angular/router';
import {Location} from '@angular/common';
import {Article} from '../../../models/article.model';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {
  article: Article ;

  constructor(
    private location: Location,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
        (data: Data) => { this.article = data['article']; }
    );
  }

  onGoBack() {
    this.location.back();
  }

}
