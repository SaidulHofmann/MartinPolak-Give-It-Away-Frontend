/* UC02-Anmelden */
/* Enables user login. */

import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ErrorCodes} from '../../models/enum.model';
import {HttpErrorArgs} from '../../models/http-error-args.model';
import {User} from '../../models/user.model';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 //  user: User = new User();

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  // ToDo: implement
  public onSubmit(form: NgForm) {
    console.log('LoginComponent.onSubmit(): Not implemented!');

    const email = form.value.email;
    const password = form.value.password;

    this.userService.login(email, password)
      .subscribe(
        (token) => console.log('LoginComponent.login(): received: ', token),
        (error: HttpErrorArgs) => {
          console.log('Bei der Anmeldung ist ein Fehler aufgetreten.');
      });
  }
}
