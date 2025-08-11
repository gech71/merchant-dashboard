
'use client';

import * as React from 'react';
import type { Branch, Company, Merchant, BranchUser } from '@/types';

// Mock Data
const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'Downtown Branch', code: 'DT001', address: '123 Main St, Anytown, USA', contact: '555-1234', status: 'Approved' },
  { id: '2', name: 'Uptown Branch', code: 'UP002', address: '456 Oak Ave, Anytown, USA', contact: '555-5678', status: 'Pending' },
  { id: '3', name: 'Westside Branch', code: 'WS003', address: '789 Pine Rd, Anytown, USA', contact: '555-9012', status: 'Approved' },
  { id: '4', name: 'Eastside Branch', code: 'ES004', address: '101 Maple Blvd, Anytown, USA', contact: '555-3456', status: 'Approved' },
  { id: '5', name: 'South Branch', code: 'SB005', address: '212 Birch Ln, Anytown, USA', contact: '555-7890', status: 'Rejected' },
];

const MOCK_COMPANIES: Company[] = [
  { id: '1', accountNumber: 'ACC001', fieldName: 'Innovate Inc.', branch: 'Downtown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo tech', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '2', accountNumber: 'ACC002', fieldName: 'Apex Solutions', branch: 'Uptown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo business', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '3', accountNumber: 'ACC003', fieldName: 'Quantum Corp', branch: 'Westside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern', approved: false, status: 'Pending' },
  { id: '4', accountNumber: 'ACC004', fieldName: 'Synergy Systems', branch: 'Downtown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo design', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '5', accountNumber: 'ACC005', fieldName: 'Pioneer Ltd.', branch: 'Eastside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo corporate', approved: false, status: 'Inactive' },
  { id: '6', accountNumber: 'ACC006', fieldName: 'Zenith Ventures', branch: 'South Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo abstract', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '7', accountNumber: 'ACC007', fieldName: 'Starlight Co.', branch: 'Uptown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric', approved: false, status: 'Pending' },
  { id: '8', accountNumber: 'ACC008', fieldName: 'Momentum', branch: 'Westside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo minimal', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '9', accountNumber: 'ACC009', fieldName: 'Nexus Group', branch: 'Downtown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo circle', approved: true, status: 'Inactive', approveUser: 'admin' },
  { id: '10', accountNumber: 'ACC010', fieldName: 'Horizon Dynamics', branch: 'Eastside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo arrow', approved: true, status: 'Active', approveUser: 'admin' },
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
  companies: Company[];
  merchants: Merchant[];
  branchUsers: BranchUser[];
  currentUser: BranchUser;
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  addCompany: (company: Omit<Company, 'branch'>) => void;
  updateCompany: (company: Company) => void;
  updateMerchant: (merchant: Merchant) => void;
  addBranchUser: (user: BranchUser) => void;
  updateBranchUser: (user: BranchUser) => void;
  updateBranchStatus: (branchId: string, status: 'Approved' | 'Rejected') => void;
  updateCompanyApproval: (companyId: string, isApproved: boolean) => void;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => void;
  updateBranchUserStatus: (userId: string, status: 'Active' | 'Inactive') => void;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = React.useState<Branch[]>(MOCK_BRANCHES);
  const [companies, setCompanies] = React.useState<Company[]>(MOCK_COMPANIES);
  const [merchants, setMerchants] = React.useState<Merchant[]>(MOCK_MERCHANTS);
  const [branchUsers, setBranchUsers] = React.useState<BranchUser[]>(MOCK_BRANCH_USERS);
  const [currentUser, setCurrentUser] = React.useState<BranchUser>(MOCK_CURRENT_USER);

  const addBranch = (branch: Branch) => setBranches(prev => [...prev, branch]);
  const updateBranch = (updatedBranch: Branch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };

  const addCompany = (company: Omit<Company, 'branch' | 'id' | 'approved' | 'status' | 'logoUrl' | 'hint' >) => {
    const newCompany: Company = {
        id: new Date().toISOString(),
        ...company,
        branch: currentUser.branch,
        approved: false,
        status: 'Pending',
        logoUrl: 'https://placehold.co/40x40.png',
        hint: 'logo new'
    };
    setCompanies(prev => [...prev, newCompany]);
  };
  const updateCompany = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => c.id === updatedCompany.id ? updatedCompany : c));
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
  
  const updateCompanyApproval = (companyId: string, isApproved: boolean) => {
    setCompanies(prev => prev.map(c => c.id === companyId 
        ? { 
            ...c, 
            approved: isApproved, 
            status: isApproved ? 'Active' : 'Inactive',
            approveUser: isApproved ? currentUser.name : undefined 
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
    companies,
    merchants,
    branchUsers,
    currentUser,
    addBranch,
    updateBranch,
    addCompany,
    updateCompany,
    updateMerchant,
    addBranchUser,
    updateBranchUser,
    updateBranchStatus,
    updateCompanyApproval,
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
