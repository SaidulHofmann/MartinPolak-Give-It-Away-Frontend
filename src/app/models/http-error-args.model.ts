import {HttpErrorResponse} from '@angular/common/http';

export class HttpErrorArgs {
  constructor(
    public error: HttpErrorResponse,
    public errorCode: string = ''
  ) { }
}
