import {Injectable, Injector} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Observable} from 'rxjs/index';
import {DialogResultType} from '../../../core/enums.core';
import {DialogComponent} from '../dialog/dialog.component';
import {DialogConfig} from '../../../core/types.core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {
  }

  private openDialog(title: string, message: string, dialogConfig: DialogConfig): Observable<DialogResultType> {
    dialogConfig.title = title;
    dialogConfig.message = message;
    let dialogRef: MatDialogRef<DialogComponent>;
    dialogRef = this.dialog.open(DialogComponent, {data: dialogConfig, panelClass: 'custom-dialog-container'});
    return dialogRef.afterClosed();
  }

  public inform(title: string, message: string): Observable<DialogResultType> {
    if (! message || message.length < 1) { return; }
    let dialogConfig = new DialogConfig();
    dialogConfig.hasOkButton = true;
    return this.openDialog(title, message, dialogConfig);
  }

  public decide(title: string, message: string): Observable<DialogResultType> {
    if (! message || message.length < 1) { return; }
    let dialogConfig = new DialogConfig();
    dialogConfig.hasYesButton = true;
    dialogConfig.hasNoButton = true;
    return this.openDialog(title, message, dialogConfig);
  }

  public askForDelete(title: string, message: string): Observable<DialogResultType> {
    if (! message || message.length < 1) { return; }
    let dialogConfig = new DialogConfig();
    dialogConfig.hasDeleteButton = true;
    dialogConfig.hasCancelButton = true;
    return this.openDialog(title, message, dialogConfig);
  }

  public askForSave(title: string, message: string): Observable<DialogResultType> {
    if (! message || message.length < 1) { return; }
    let dialogConfig = new DialogConfig();
    dialogConfig.hasSaveButton = true;
    dialogConfig.hasCancelButton = true;
    return this.openDialog(title, message, dialogConfig);
  }

}
