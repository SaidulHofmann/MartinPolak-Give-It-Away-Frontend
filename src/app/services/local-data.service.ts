import {Injectable, OnDestroy} from '@angular/core';
import {ArticleFilter} from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService implements OnDestroy {

  // Constants, variables
  // ----------------------------------
  public articleFilter: ArticleFilter = null;


  // Properties
  // ----------------------------------


  // Methods
  // ----------------------------------
  constructor() {
    this.init();
  }

  private init() {
    this.articleFilter = this.loadObject('articleFilter');
  }

  public ngOnDestroy() {
    this.saveObject('articleFilter', this.articleFilter);
  }

  public SaveArticleFilter() {
    this.saveObject('articleFilter', this.articleFilter);
  }

  private saveObject(name: string, value: any) {
    localStorage.setItem('name', JSON.stringify(value));
  }

  private loadObject(name: string): any {
    return JSON.parse(localStorage.getItem('name') || null);
  }
}
