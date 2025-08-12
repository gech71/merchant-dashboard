

export type AllowedCompany = {
  Oid: string;
  ID: string;
  ACCOUNTNUMBER: string;
  FIELDNAME: string;
  APPROVEUSER?: string;
  APPROVED: boolean;
  STATUS: 'Active' | 'Inactive' | 'Pending';
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
  OptimisticLockField: number;
  GCRecord: number;
};

export type Branch = {
  id: string;
  name: string;
  code: string;
  address: string;
  contact: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type Merchant_users = {
  ID: string;
  ACCOUNTNUMBER: string;
  FULLNAME: string;
  ACCOUNTTYPE: string;
  PHONENUMBER: string;
  ROLE: 'Admin' | 'Sales';
  DEVICENAME: string;
  ENCRYPTIONKEY: string;
  iV: string;
  ISLOGGEDIN: boolean;
  authenticationkey: string;
  STATUS: 'Active' | 'Pending' | 'Disabled';
  FAILEDATTMEPTS: number;
  LASTLOGINATTEMPT: string;
  ISLOCKED: boolean;
  UNLOCKEDTIME: string;
  VALUE3: string;
  INSERTUSERID: string;
  UPDATEUSERID: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  // This is needed for the relationship with AllowedCompany, not in the new list but required for functionality
  company: string; 
};


export type BranchUser = {
  id: string;
  name: string;
  email: string;
  branch: string;
  status: 'Active' | 'Inactive' | 'Pending';
};

export type EditableItem = AllowedCompany | Branch | Merchant_users | BranchUser | null;
