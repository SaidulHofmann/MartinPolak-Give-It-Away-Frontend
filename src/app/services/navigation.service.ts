import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor( private router: Router) { }

  public loginPage() {
    this.router.navigate(['/users/login']);
  }

  public registerPage() {
    this.router.navigate(['/users/register']);
  }

  public articleOverviewPage() {
    this.router.navigate(['/articles']);
  }
}
