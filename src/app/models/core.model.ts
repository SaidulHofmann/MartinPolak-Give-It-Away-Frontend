import {HttpErrorResponse} from '@angular/common/http';

export class IdNamePair {
  _id = '';
  name = '';
}

export class Pager {
  totalItems:   number = 0;
  currentPage:  number = 0;
  pageSize:     number = 0;
  totalPages:   number = 0;
  startPage:    number = 0;
  endPage:      number = 0;
  startIndex:   number = 0;
  endIndex:     number = 0;
  pages:        number[] = [];
}

export class DialogConfig {
  title: string;
  message: string;

  hasOkButton: boolean = false;
  hasYesButton: boolean = false;
  hasNoButton: boolean = false;
  hasSaveButton: boolean = false;
  hasDeleteButton: boolean = false;
  hasCancelButton: boolean = false;
}

export class HttpErrorArgs {
  constructor(
    public error: HttpErrorResponse,
    public errorCode: string = ''
  ) { }
}
