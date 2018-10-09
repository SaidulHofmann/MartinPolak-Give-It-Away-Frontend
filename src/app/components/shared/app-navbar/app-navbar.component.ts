import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';
import {AuthService} from '../../permission/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {
  public currentUrl: string = '';

  constructor(
    public authService: AuthService,
    private router: Router) {
  }

  public ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url;
      }
    });
  }

  public logout() {
    this.authService.logout();
  }

  private showCurrentRoutes() {
    console.log('AppNavbarComponent: Angular router registered paths:');
    for (let i = 0; i < this.router.config.length; i++) {
      let routePath: string = this.router.config[i].path;
      console.log(routePath);
    }
  }
}
