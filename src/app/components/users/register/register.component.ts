// UC01-Registrieren
// Creates an user account

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../../services/user.service';
import {User} from '../../../models/user.model';
import {ErrorCodeType} from '../../../core/enums.core';
import {HttpErrorArgs} from '../../../core/types.core';
import {DialogService} from '../../../services/dialog.service';
import {getErrorJSON} from '../../../core/errors.core';
import {NavigationService} from '../../../services/navigation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = new User();

  constructor(
    public navService: NavigationService,
    private userService: UserService,
    private dialogService: DialogService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.userService.registerUser(this.user).subscribe(
      (savedUser: User) => {
        this.dialogService.inform('Registrieren',
          'Das Benutzerkonto wurde erfolgreich erstellt.');
        this.navService.loginPage();
      },
      (errorResponse) => {
        let errorJson = getErrorJSON(errorResponse);
        if (errorJson && errorJson.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Registrieren',
            errorJson.message || 'Die E-Mail Adresse wird bereits verwendet.');
          this.user.email = '';
        } else {
          this.dialogService.inform('Registrieren',
            errorJson.message || 'Bei der Erstellung des Benutzerkontos ist ein Fehler aufgetreten.');
        }
      }
    );
  }
}
