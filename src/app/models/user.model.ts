export default class User {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;

  createdAt = new Date();
  updatedAt = new Date();
}
