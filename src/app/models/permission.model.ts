
export class Permission {
  _id = undefined;
  name = '';
  isPredefined = false;

  articleOwnCreate = true;
  articleOwnUpdate = true;
  articleOwnDelete = true;
  articleOwnDonate = true;

  articleOtherUpdate = false;
  articleOtherDelete = false;
  articleOtherDonate = false;

  userCreate = false;
  userRead = false;
  userUpdate = false;
  userDelete = false;

  permissionCreate = false;
  permissionRead = false;
  permissionUpdate = false;
  permissionDelete = false;

  createdAt = new Date();
  updatedAt = new Date();
}

export class PermissionRef {
  constructor(
    public _id = null,
    public name = '') {}
}

export class HttpResponsePermissions {
  status = '';
  data: HttpResponsePermissionData = null;
  message = '';

}

export class HttpResponsePermissionData {
  docs: Permission[] = [];
  total = 0;
  limit = 0;
  page = 0;
  pages = 0;
}

export class PermissionFilter {
  _id: string = '';
  name: string = '';
  isPredefined: boolean = false;

  filter: string = '';
  sort: string = '';
  pageIndex: number = 0;
  limit: number = 5;
  total: number = 1;
  pageSizeOptions = [3, 5, 10, 20];

  public get page(): number { return this.pageIndex + 1; }
}

