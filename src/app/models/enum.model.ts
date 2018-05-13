
export enum EditModeType {
  Create,
  Read,
  Update,
  Delete
}

export enum ErrorCodeType {
  MongoDB_DuplicateKey = 'E11000',
  Client_Side_Or_Network_Error = 'Client_Side_Or_Network_Error',
  Authentication_Failed = 'Authentication_Failed'
}

export enum ArticleStatusType {
  available = 'available',
  handoverPending = 'handoverPending',
  donated = 'donated'
}

