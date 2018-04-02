/* UC01-Registrieren */
/* Creates an user account */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  loading = false;

  constructor(
    private router: Router,
    private userService: UserService) { }

  register() {
    this.loading = true;
    this.userService.register(this.user)
      .subscribe(
        data => {
          // set success message and pass true paramater to persist the message after redirecting to the login page

          this.router.navigate(['/login']);
        },
        error => {

          this.loading = false;
        });
  }

  ngOnInit() {
  }

}
