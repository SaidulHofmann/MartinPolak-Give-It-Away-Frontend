
export enum EditModeType {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete'
}

export enum ErrorCodeType {
  DuplicateKeyError = 'DuplicateKeyError',
  Client_Side_Or_Network_Error = 'Client_Side_Or_Network_Error',
  Authentication_Failed = 'Authentication_Failed'
}

export enum ArticleStatusType {
  available = 'available',
  handoverPending = 'handoverPending',
  donated = 'donated'
}

export enum DialogResultType {
  Ok = 'Ok',
  Yes = 'Yes',
  No = 'No',
  Save = 'Save',
  Delete = 'Delete',
  Cancel = 'Cancel'
}

