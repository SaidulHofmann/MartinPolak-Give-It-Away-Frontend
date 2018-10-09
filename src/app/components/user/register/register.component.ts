// UC01-Registrieren
// Creates an user account

import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user.model';
import {ErrorCodeType} from '../../../core/enums.core';
import {ErrorDetails} from '../../../core/types.core';
import {DialogService} from '../../shared/services/dialog.service';
import {getCustomOrDefaultError} from '../../../core/errors.core';
import {NavigationService} from '../../shared/services/navigation.service';
import {AuthService} from '../../permission/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = new User();

  constructor(
    private authService: AuthService,
    public navService: NavigationService,
    private dialogService: DialogService) { }

  ngOnInit() {
  }

  onSubmit() {
    this.authService.createUser(this.user).subscribe(
      (savedUser: User) => {
        this.dialogService.inform('Registrieren',
          'Das Benutzerkonto wurde erfolgreich erstellt.');
        this.navService.gotoLoginPage();
      },
      (errorResponse) => {
        let errorDetails: ErrorDetails = getCustomOrDefaultError(errorResponse);
        if (errorDetails && errorDetails.name === ErrorCodeType.DuplicateKeyError) {
          this.dialogService.inform('Registrieren',
            errorDetails.message || 'Die E-Mail Adresse wird bereits verwendet.');
          this.user.email = '';
        } else {
          this.dialogService.inform('Registrieren',
            errorDetails.message || 'Bei der Erstellung des Benutzerkontos ist ein Fehler aufgetreten.');
        }
      }
    );
  }
}
