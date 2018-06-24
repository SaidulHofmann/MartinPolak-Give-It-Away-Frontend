import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {
  public currentUrl: string = '';

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.url;
      }
    });
  }

  public logout() {
    this.userService.logout();
  }
}
