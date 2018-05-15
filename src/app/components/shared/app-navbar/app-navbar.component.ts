import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {

  constructor(
    public userService: UserService
  ) { }

  public ngOnInit() {
  }

  public logout() {
    this.userService.logout();
  }
}
