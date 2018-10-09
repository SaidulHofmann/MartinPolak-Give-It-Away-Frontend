import {Permission} from './permission.model';

export class User {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  fullname: string;

  createdAt = new Date();
  updatedAt = new Date();

  authToken = '';
  permission: Permission = null;
}

export class UserRef {
  public firstname: string;
  public lastname: string;
  public fullname: string;

  constructor(
    public _id: string,
  ) { }
}

export class HttpResponseUser {
  status = '';
  data: User = null;
  message = '';
}

export class HttpResponseUsers {
  status = '';
  data: HttpResponseUserData = null;
  message = '';
}

export class HttpResponseUserData {
  docs: User[] = [];
  total = 0;
  limit = 0;
  page = 0;
  pages = 0;
}

export class UserFilter {
  _id: string = '';
  email: string = '';
  firstname: string = '';
  lastname: string = '';

  filter: string = '';
  sort: string = '';
  pageIndex: number = 0;
  limit: number = 10;
  total: number = 1;
  pageSizeOptions = [3, 5, 10, 20];

  public get page(): number { return this.pageIndex + 1; }
}
