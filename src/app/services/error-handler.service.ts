import {ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import {DialogService} from './dialog.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DialogConfig, ErrorDetails, HttpErrorArgs} from '../core/types.core';
import {getCustomOrDefaultError, getErrorText} from '../core/errors.core';
import {UserService} from './user.service';
import {Observable} from 'rxjs/index';
import {MatDialog, MatDialogRef} from '@angular/material';
import {DialogResultType} from '../core/enums.core';
import {DialogComponent} from '../components/shared/dialog/dialog.component';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

  private isDisplayingError: boolean = false;

  constructor(
    private ngZone: NgZone,
    private dialogService: DialogService,
    private userService: UserService) {
    super();
  }

  public handleError(error: any): void {

    if (!error || !error.message || error.message.length === 0) {
      this.showErrorDialog('Fehler', 'Ein unbekannter Fehler ist aufgetreten.');
      return;
    }

    // Server-side or connection errors.
    if (error instanceof HttpErrorResponse) {

      // Offline - server or connection error.
      if (!navigator.onLine) {
        this.showErrorDialog('Verbindungs-Fehler', 'Es besteht keine Verbindung zum Server. \n' + getErrorText(error));

        // Online - Http Errors.
      } else {
        if (error.status === 401) {
          this.handleError401(error);
        } else {
          this.showErrorDialog('Serverseitiger Fehler', 'Ein serverseitiger Fehler ist aufgetreten: \n' + getErrorText(error));
        }

      }
      // Client-side errors.
    } else {
      this.showErrorDialog('Clientseitiger Fehler', 'Ein clientseitiger Fehler ist aufgetreten: \n' + getErrorText(error));

    }

    super.handleError(error);
  }

  /**
   * Shows the error dialog in NgZone.
   * The error handler is executed outside the NgZone. Angular will not react on UI changes.
   * Currently the dialog will not be displayed correctly and will not respond to user interactions if not in NgZone.
   * Displays only one dialog to prevent infinite loop (displaying error causes error, displaying this error causes same error...).
   */
  private showErrorDialog(title: string, message: string) {
    if (!this.isDisplayingError) {
      this.isDisplayingError = true;
      this.ngZone.run(() => {
        this.dialogService.inform(title, message).subscribe(() => {
          this.isDisplayingError = false;
        });
     });
    } else {
      console.log(title + ': ' + message);
    }
  }

  private handleError401(error: any) {
    this.showErrorDialog('Berechtigungs-Fehler',
      'Der Zugriff auf Server Ressourcen ist nicht möglich weil der Benutzer ' +
      'nicht angemeldet oder die Anmeldung abgelaufen ist. \n' + getErrorText(error));
    this.userService.logout();
  }

}
