
export class User {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;

  createdAt = null;
  updatedAt = null;
}

export class UserRef {
  _id: string;
  firstname: string;
  lastname: string;
}
