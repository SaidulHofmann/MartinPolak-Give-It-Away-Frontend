
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

export enum ArticleDonationStatus {
  ApplicantArticleAvailable = 'ApplicantArticleAvailable',
  ApplicantArticleHandoverPendingIsDonee = 'ApplicantArticleHandoverPendingIsDonee',
  ApplicantArticleHandoverPendingIsNotDonee = 'ApplicantArticleHandoverPendingIsNotDonee',
  ApplicantArticleDonatedIsDonee = 'ApplicantArticleDonatedIsDonee',
  ApplicantArticleDonatedIsNotDonee = 'ApplicantArticleDonatedIsNotDonee',

  NonApplicantArticleAvailable = 'NonApplicantArticleAvailable',
  NonApplicantArticleHandoverPending = 'NonApplicantArticleHandoverPending',
  NonApplicantArticleDonated = 'NonApplicantArticleDonated',

  PublisherArticleAvailable = 'PublisherArticleAvailable',
  PublisherArticleHandoverPending = 'PublisherArticleHandoverPending',
  PublisherArticleDonated = 'PublisherArticleDonated',
}

export enum PermissionType {
  articleOwnCreate = 'articleOwnCreate',
  articleOwnUpdate = 'articleOwnUpdate',
  articleOwnDelete = 'articleOwnDelete',
  articleOwnDonate = 'articleOwnDonate',

  articleOtherUpdate = 'articleOtherUpdate',
  articleOtherDelete = 'articleOtherDelete',
  articleOtherDonate = 'articleOtherDonate',

  userCreate = 'userCreate',
  userRead = 'userRead',
  userUpdate = 'userUpdate',
  userDelete = 'userDelete',

  permissionCreate = 'permissionCreate',
  permissionRead = 'permissionRead',
  permissionUpdate = 'permissionUpdate',
  permissionDelete = 'permissionDelete'
}

