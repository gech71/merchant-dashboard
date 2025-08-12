

'use client';

import * as React from 'react';
import type { Branch, AllowedCompany, Merchant, BranchUser } from '@/types';

// Mock Data
const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'Downtown Branch', code: 'DT001', address: '123 Main St, Anytown, USA', contact: '555-1234', status: 'Approved' },
  { id: '2', name: 'Uptown Branch', code: 'UP002', address: '456 Oak Ave, Anytown, USA', contact: '555-5678', status: 'Pending' },
  { id: '3', name: 'Westside Branch', code: 'WS003', address: '789 Pine Rd, Anytown, USA', contact: '555-9012', status: 'Approved' },
  { id: '4', name: 'Eastside Branch', code: 'ES004', address: '101 Maple Blvd, Anytown, USA', contact: '555-3456', status: 'Approved' },
  { id: '5', name: 'South Branch', code: 'SB005', address: '212 Birch Ln, Anytown, USA', contact: '555-7890', status: 'Rejected' },
];

const MOCK_ALLOWED_COMPANIES: AllowedCompany[] = [
  { Oid: '1', ID: 'C001', ACCOUNTNUMBER: 'ACC001', FIELDNAME: 'Innovate Inc.', APPROVEUSER: 'admin', APPROVED: true, STATUS: 'Active', INSERTDATE: '2023-01-15', UPDATEDATE: '2023-01-15', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: '2', ID: 'C002', ACCOUNTNUMBER: 'ACC002', FIELDNAME: 'Apex Solutions', APPROVEUSER: 'admin', APPROVED: true, STATUS: 'Active', INSERTDATE: '2023-02-20', UPDATEDATE: '2023-02-20', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: '3', ID: 'C003', ACCOUNTNUMBER: 'ACC003', FIELDNAME: 'Quantum Corp', APPROVED: false, STATUS: 'Pending', INSERTDATE: '2023-03-10', UPDATEDATE: '2023-03-10', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: '4', ID: 'C004', ACCOUNTNUMBER: 'ACC004', FIELDNAME: 'Synergy Systems', APPROVEUSER: 'admin', APPROVED: true, STATUS: 'Active', INSERTDATE: '2023-04-05', UPDATEDATE: '2023-04-05', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: '5', ID: 'C005', ACCOUNTNUMBER: 'ACC005', FIELDNAME: 'Pioneer Ltd.', APPROVEUSER: 'admin', APPROVED: false, STATUS: 'Inactive', INSERTDATE: '2023-05-12', UPDATEDATE: '2023-05-12', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
];

const MOCK_MERCHANTS: Merchant[] = [
    { id: '1', name: 'The Corner Cafe Admin', company: 'Innovate Inc.', email: 'contact@cornercafe.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'QuickMart Admin', company: 'Apex Solutions', email: 'support@quickmart.com', role: 'Admin', status: 'Active' },
    { id: '3', name: 'Gadget Hub Admin', company: 'Quantum Corp', email: 'sales@gadgethub.com', role: 'Admin', status: 'Pending' },
    { id: '4', name: 'Style Central Admin', company: 'Synergy Systems', email: 'info@stylecentral.com', role: 'Admin', status: 'Active' },
    { id: '5', name: 'Bookworm Haven Admin', company: 'Pioneer Ltd.', email: 'orders@bookwormhaven.com', role: 'Admin', status: 'Disabled' },
    { id: '6', name: 'Alice Johnson', company: 'Innovate Inc.', email: 'alice.j@example.com', role: 'Sales', status: 'Active' },
    { id: '7', name: 'Bob Williams', company: 'Apex Solutions', email: 'bob.w@example.com', role: 'Sales', status: 'Active' },
    { id: '8', name: 'Diana Prince', company: 'Synergy Systems', email: 'diana.p@example.com', role: 'Sales', status: 'Pending' },
  ];

const MOCK_BRANCH_USERS: BranchUser[] = [
  { id: '1', name: 'John Doe', email: 'john.d@branch.com', branch: 'Downtown Branch', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.s@branch.com', branch: 'Uptown Branch', status: 'Active' },
  { id: '3', name: 'Peter Jones', email: 'peter.j@branch.com', branch: 'Downtown Branch', status: 'Inactive' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@branch.com', branch: 'Westside Branch', status: 'Pending' },
  { id: '5', name: 'David Williams', email: 'david.w@branch.com', branch: 'Uptown Branch', status: 'Active' },
];

const MOCK_CURRENT_USER: BranchUser = MOCK_BRANCH_USERS[0];

type DataContextType = {
  branches: Branch[];
  allowedCompanies: AllowedCompany[];
  merchants: Merchant[];
  branchUsers: BranchUser[];
  currentUser: BranchUser;
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  addAllowedCompany: (company: Omit<AllowedCompany, 'Oid' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => void;
  updateAllowedCompany: (company: AllowedCompany) => void;
  updateMerchant: (merchant: Merchant) => void;
  addBranchUser: (user: BranchUser) => void;
  updateBranchUser: (user: BranchUser) => void;
  updateBranchStatus: (branchId: string, status: 'Approved' | 'Rejected') => void;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => void;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => void;
  updateBranchUserStatus: (userId: string, status: 'Active' | 'Inactive') => void;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = React.useState<Branch[]>(MOCK_BRANCHES);
  const [allowedCompanies, setAllowedCompanies] = React.useState<AllowedCompany[]>(MOCK_ALLOWED_COMPANIES);
  const [merchants, setMerchants] = React.useState<Merchant[]>(MOCK_MERCHANTS);
  const [branchUsers, setBranchUsers] = React.useState<BranchUser[]>(MOCK_BRANCH_USERS);
  const [currentUser, setCurrentUser] = React.useState<BranchUser>(MOCK_CURRENT_USER);

  const addBranch = (branch: Branch) => setBranches(prev => [...prev, branch]);
  const updateBranch = (updatedBranch: Branch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };

  const addAllowedCompany = (company: Omit<AllowedCompany, 'Oid' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => {
    const now = new Date().toISOString();
    const newCompany: AllowedCompany = {
        ...company,
        Oid: new Date().toISOString(),
        APPROVED: false,
        STATUS: 'Pending',
        INSERTDATE: now,
        UPDATEDATE: now,
        INSERTUSER: currentUser.name,
        UPDATEUSER: currentUser.name,
        OptimisticLockField: 0,
        GCRecord: 0,
    };
    setAllowedCompanies(prev => [...prev, newCompany]);
  };
  const updateAllowedCompany = (updatedCompany: AllowedCompany) => {
    setAllowedCompanies(prev => prev.map(c => c.Oid === updatedCompany.Oid ? {...updatedCompany, UPDATEDATE: new Date().toISOString(), UPDATEUSER: currentUser.name} : c));
  };
  
  const updateMerchant = (updatedMerchant: Merchant) => {
    setMerchants(prev => prev.map(m => m.id === updatedMerchant.id ? updatedMerchant : m));
  };

  const addBranchUser = (user: BranchUser) => setBranchUsers(prev => [...prev, user]);
  const updateBranchUser = (updatedUser: BranchUser) => {
    setBranchUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateBranchStatus = (branchId: string, status: 'Approved' | 'Rejected') => {
    setBranches(prev => prev.map(b => b.id === branchId ? { ...b, status } : b));
  };
  
  const updateAllowedCompanyApproval = (companyId: string, isApproved: boolean) => {
    setAllowedCompanies(prev => prev.map(c => c.Oid === companyId 
        ? { 
            ...c, 
            APPROVED: isApproved, 
            STATUS: isApproved ? 'Active' : 'Inactive',
            APPROVEUSER: isApproved ? currentUser.name : undefined 
          } 
        : c
    ));
  };

  const updateMerchantStatus = (merchantId: string, status: 'Active' | 'Disabled') => {
    setMerchants(prev => prev.map(m => m.id === merchantId ? { ...m, status } : m));
  };
  
  const updateBranchUserStatus = (userId: string, status: 'Active' | 'Inactive') => {
    setBranchUsers(prev => prev.map(user => user.id === userId ? { ...user, status } : user));
  };

  const value = {
    branches,
    allowedCompanies,
    merchants,
    branchUsers,
    currentUser,
    addBranch,
    updateBranch,
    addAllowedCompany,
    updateAllowedCompany,
    updateMerchant,
    addBranchUser,
    updateBranchUser,
    updateBranchStatus,
    updateAllowedCompanyApproval,
    updateMerchantStatus,
    updateBranchUserStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}
