export type Company = {
  id: string;
  name: string;
  sales: number;
  logoUrl: string;
  hint: string;
  status: 'Approved' | 'Pending' | 'Rejected';
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
  status: 'Active' | 'Pending' | 'Disabled';
};

export type SalesRep = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Active' | 'Inactive' | 'Pending';
};
