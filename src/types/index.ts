

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

export type Merchant = {
  id: string;
  name: string;
  company: string;
  email: string;
  role: 'Admin' | 'Sales';
  status: 'Active' | 'Pending' | 'Disabled';
};

export type BranchUser = {
  id: string;
  name: string;
  email: string;
  branch: string;
  status: 'Active' | 'Inactive' | 'Pending';
};

export type EditableItem = AllowedCompany | Branch | Merchant | BranchUser | null;
