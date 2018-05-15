/* UC02-Anmelden */
/* Enables user login. */

import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {ErrorCodeType} from '../../../models/enum.model';
import {HttpErrorArgs} from '../../../models/http-error-args.model';
import {User} from '../../../models/user.model';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 public message = '';

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
  }

  // ToDo: implement
  public onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.userService.login(email, password)
      .subscribe(
        (user: User) => { this.gotoArticleOverviewPage(); },
        (error: HttpErrorArgs) => {
          if (error.errorCode === ErrorCodeType.Authentication_Failed) {
            this.message = 'Benutzername oder Passwort ungültig.';
          }
          setTimeout(() => this.message = '', 5000);
      });
  }

  gotoArticleOverviewPage() {
    this.router.navigate(['/articles']);
  }
}
