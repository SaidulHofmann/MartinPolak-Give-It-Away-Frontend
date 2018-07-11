import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor( private router: Router) { }

  public gotoLoginPage() {
    this.router.navigate(['/users/login']);
  }

  public gotoRegisterPage() {
    this.router.navigate(['/users/register']);
  }

  public gotoArticleOverviewPage() {
    this.router.navigate(['/articles']);
  }
}
