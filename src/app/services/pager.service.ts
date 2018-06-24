import { Injectable } from '@angular/core';
import {Pager} from '../core/types.core';

@Injectable()
export class PagerService {
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 10): Pager {
    // Calculate total pages.
    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // Less than 10 total pages so show all.
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 10 total pages so calculate start and end pages.
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // Calculate start and end item indexes.
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // Create an array of pages for *ngFor in the pager control.
    let pages = Array.from(new Array(endPage+1 - startPage), (value, index) => startPage + index);

    // Return object with all pager properties required by the view.
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    } as Pager;
  }
}
