import {ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import {DialogService} from './dialog.service';
import {HttpErrorResponse} from '@angular/common/http';
import {getCustomOrDefaultError, getErrorText} from '../../../core/errors.core';
import {AuthService} from '../../permission/services/auth.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

  private dialogService: DialogService;
  private authService: AuthService;

  constructor(
    private injector: Injector) {
    super();
  }

  public handleError(error: any): void {
    try {
        if (this.dialogService == null) { this.dialogService = this.injector.get(DialogService); }
        if (this.authService == null) { this.authService = this.injector.get(AuthService); }
        let zone: NgZone = this.injector.get(NgZone);
        zone.run(() => {

          if (!error || !error.message || error.message.length === 0) {
            this.dialogService.inform('Fehler', 'Ein unbekannter Fehler ist aufgetreten.');
            return;
          }

          // Server-side or connection errors.
          if (error instanceof HttpErrorResponse) {

            // Offline - server or connection error.
            if (!navigator.onLine) {
              this.dialogService.inform('Verbindungs-Fehler', 'Es besteht keine Verbindung zum Server. \n' + getErrorText(error));

              // Online - Http Errors.
            } else {
              if (error.status === 401) {
                this.handleError401(error);
              } else {
                this.dialogService.inform('Serverseitiger Fehler', 'Ein serverseitiger Fehler ist aufgetreten: \n' + getErrorText(error));
              }

            }
            // Client-side errors.
          } else {
            this.dialogService.inform('Clientseitiger Fehler', 'Ein clientseitiger Fehler ist aufgetreten: \n' + getErrorText(error));

          }

          super.handleError(error);
        });

    } catch (ex) {
        confirm('Ein unerwarteter Fehler ist aufgetreten: ' + ex.message);
        super.handleError(error);
      }
  }

  private handleError401(error: any) {
    this.dialogService.inform('Berechtigungs-Fehler',
      'Der Zugriff auf Server Ressourcen ist nicht möglich weil der Benutzer ' +
      'nicht angemeldet oder die Anmeldung abgelaufen ist. \n' + getErrorText(error));
    this.authService.logout();
  }

}
