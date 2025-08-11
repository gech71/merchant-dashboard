
export type Company = {
  id: string;
  accountNumber: string;
  fieldName: string;
  branch: string;
  approveUser?: string;
  logoUrl: string;
  hint: string;
  approved: boolean;
  status: 'Active' | 'Inactive' | 'Pending';
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

export type EditableItem = Company | Branch | Merchant | BranchUser | null;
