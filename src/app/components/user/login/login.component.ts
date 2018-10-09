/* UC02-Anmelden */
/* Enables user login. */

import { Component, OnInit } from '@angular/core';
import {ErrorDetails} from '../../../core/types.core';
import {User} from '../../../models/user.model';
import {NgForm} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {DialogService} from '../../shared/services/dialog.service';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {NavigationService} from '../../shared/services/navigation.service';
import {AuthService} from '../../permission/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
 public message = '';

  constructor(
    private authService: AuthService,
    public navService: NavigationService,
    private dialogService: DialogService) { }

  ngOnInit() {
  }

  public onSubmit(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;

    this.authService.login(email, password)
      .subscribe(
        (user: User) => { this.navService.gotoArticleOverviewPage(); },
        (errorResponse: HttpErrorResponse) => {
          let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
          if (errorResponse.status === 401) {
            this.dialogService.inform('Anmelden',
              errorDetails.message || 'E-Mail oder Passwort ungültig.');
          } else {
            this.dialogService.inform('Anmelden',
              errorDetails.message || 'Bei der Anmeldung ist ein Fehler aufgetreten.');
          }
        }
      );
  }

}
