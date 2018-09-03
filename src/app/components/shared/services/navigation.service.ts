import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor( private router: Router,
               private location: Location) { }


  public goBack() {
    this.location.back();
  }

  public gotoLoginPage() {
    this.router.navigate(['/users/login']);
  }

  public gotoRegisterPage() {
    this.router.navigate(['/users/register']);
  }

  public gotoArticleOverviewPage() {
    this.router.navigate(['/articles']);
  }

  public gotoArticleDetailsPage(articleId: string) {
    this.router.navigate([`/articles/${articleId}/details`]);
  }

  public gotoArticleEditPage(articleId: string) {
    this.router.navigate([`/articles/${articleId}/edit`]);
  }

  public gotoArticleGiveAwayPage(articleId: string) {
    this.router.navigate([`/articles/${articleId}/giveAway`]);
  }
}
