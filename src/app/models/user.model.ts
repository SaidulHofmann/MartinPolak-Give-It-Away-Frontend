import {Article} from './article.model';

export class User {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;

  createdAt = null;
  updatedAt = null;

  authToken = '';
}

export class UserRef {
  public firstname: string;
  public lastname: string;

  constructor(
    public _id: string,
  ) { }
}

export class HttpResponseUser {
  status = '';
  data: User = null;
  message = '';
}

