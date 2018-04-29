import { Component, OnInit } from '@angular/core';
import {EditModeType} from '../../../models/index.model';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {
  public EditModeType = EditModeType;

  constructor() { }

  public ngOnInit() {
  }

}
