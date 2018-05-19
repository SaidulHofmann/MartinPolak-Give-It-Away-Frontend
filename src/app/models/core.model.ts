
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
