import {HttpErrorResponse} from '@angular/common/http';
import {MatPaginatorIntl} from '@angular/material';

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

export class ErrorDetails {
    name: string = '';
    message: string = '';
    status: number = 0;
}

export class MatPaginatorIntlDe extends MatPaginatorIntl {
  itemsPerPageLabel = 'Einträge pro Seite';
  firstPageLabel = 'Erste Seite';
  lastPageLabel = 'Letzte Seite';
  nextPageLabel     = 'Nächste Seite';
  previousPageLabel = 'Vorherige Seite';

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 von ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' von ' + length;
  };
}
