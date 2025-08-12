

'use client';

import * as React from 'react';
import type { Branch, allowed_companies, Merchant_users, BranchUser, merchants_daily_balances, merchant_txns } from '@/types';

// Mock Data
const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'Downtown Branch', code: 'DT001', address: '123 Main St, Anytown, USA', contact: '555-1234', status: 'Approved' },
  { id: '2', name: 'Uptown Branch', code: 'UP002', address: '456 Oak Ave, Anytown, USA', contact: '555-5678', status: 'Pending' },
  { id: '3', name: 'Westside Branch', code: 'WS003', address: '789 Pine Rd, Anytown, USA', contact: '555-9012', status: 'Approved' },
  { id: '4', name: 'Eastside Branch', code: 'ES004', address: '101 Maple Blvd, Anytown, USA', contact: '555-3456', status: 'Approved' },
  { id: '5', name: 'South Branch', code: 'SB005', address: '212 Birch Ln, Anytown, USA', contact: '555-7890', status: 'Rejected' },
];

const MOCK_ALLOWED_COMPANIES: allowed_companies[] = [
  { Oid: 'oid_C001', ID: 'C001', ACCOUNTNUMBER: 'ACC001', FIELDNAME: 'Innovate Inc.', APPROVEUSER: 'admin', APPROVED: true, STATUS: 'Active', INSERTDATE: '2023-01-15', UPDATEDATE: '2023-01-15', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: 'oid_C002', ID: 'C002', ACCOUNTNUMBER: 'ACC002', FIELDNAME: 'Apex Solutions', APPROVEUSER: 'admin', APPROVED: true, STATUS: 'Active', INSERTDATE: '2023-02-20', UPDATEDATE: '2023-02-20', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: 'oid_C003', ID: 'C003', ACCOUNTNUMBER: 'ACC003', FIELDNAME: 'Quantum Corp', APPROVED: false, STATUS: 'Pending', INSERTDATE: '2023-03-10', UPDATEDATE: '2023-03-10', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: 'oid_C004', ID: 'C004', ACCOUNTNUMBER: 'ACC004', FIELDNAME: 'Synergy Systems', APPROVEUSER: 'admin', APPROVED: true, STATUS: 'Active', INSERTDATE: '2023-04-05', UPDATEDATE: '2023-04-05', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
  { Oid: 'oid_C005', ID: 'C005', ACCOUNTNUMBER: 'ACC005', FIELDNAME: 'Pioneer Ltd.', APPROVEUSER: 'admin', APPROVED: false, STATUS: 'Inactive', INSERTDATE: '2023-05-12', UPDATEDATE: '2023-05-12', INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0 },
];

const MOCK_MERCHANT_USERS: Merchant_users[] = [
  { ID: '1',  FULLNAME: 'The Corner Cafe Admin', ROLE: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '111-222-3333', DEVICENAME: 'Device1', ENCRYPTIONKEY: 'key1', iV: 'iv1', ISLOGGEDIN: true, authenticationkey: 'auth1', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: '2023-06-01', ISLOCKED: false, UNLOCKEDTIME: '', VALUE3: 'v3_1', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-01-15', UPDATEDATE: '2023-01-15' },
  { ID: '2',  FULLNAME: 'QuickMart Admin', ROLE: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC002', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '222-333-4444', DEVICENAME: 'Device2', ENCRYPTIONKEY: 'key2', iV: 'iv2', ISLOGGEDIN: false, authenticationkey: 'auth2', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: '2023-06-01', ISLOCKED: false, UNLOCKEDTIME: '', VALUE3: 'v3_2', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-02-20', UPDATEDATE: '2023-02-20' },
  { ID: '3',  FULLNAME: 'Gadget Hub Admin', ROLE: 'Admin', STATUS: 'Pending', ACCOUNTNUMBER: 'ACC003', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '333-444-5555', DEVICENAME: 'Device3', ENCRYPTIONKEY: 'key3', iV: 'iv3', ISLOGGEDIN: false, authenticationkey: 'auth3', FAILEDATTMEPTS: 2, LASTLOGINATTEMPT: '2023-05-28', ISLOCKED: true, UNLOCKEDTIME: '2023-06-01T10:00:00Z', VALUE3: 'v3_3', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-03-10', UPDATEDATE: '2023-03-10' },
  { ID: '4',  FULLNAME: 'Style Central Admin', ROLE: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC004', ACCOUNTTYPE: 'TypeC', PHONENUMBER: '444-555-6666', DEVICENAME: 'Device4', ENCRYPTIONKEY: 'key4', iV: 'iv4', ISLOGGEDIN: true, authenticationkey: 'auth4', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: '2023-06-01', ISLOCKED: false, UNLOCKEDTIME: '', VALUE3: 'v3_4', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-04-05', UPDATEDATE: '2023-04-05' },
  { ID: '5',  FULLNAME: 'Bookworm Haven Admin', ROLE: 'Admin', STATUS: 'Disabled', ACCOUNTNUMBER: 'ACC005', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '555-666-7777', DEVICENAME: 'Device5', ENCRYPTIONKEY: 'key5', iV: 'iv5', ISLOGGEDIN: false, authenticationkey: 'auth5', FAILEDATTMEPTS: 5, LASTLOGINATTEMPT: '2023-05-20', ISLOCKED: true, UNLOCKEDTIME: '', VALUE3: 'v3_5', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-05-12', UPDATEDATE: '2023-05-12' },
  { ID: '6',  FULLNAME: 'Alice Johnson', ROLE: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '666-777-8888', DEVICENAME: 'Device6', ENCRYPTIONKEY: 'key6', iV: 'iv6', ISLOGGEDIN: false, authenticationkey: 'auth6', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: '2023-06-01', ISLOCKED: false, UNLOCKEDTIME: '', VALUE3: 'v3_6', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-01-15', UPDATEDATE: '2023-01-15' },
  { ID: '7',  FULLNAME: 'Bob Williams', ROLE: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC002', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '777-888-9999', DEVICENAME: 'Device7', ENCRYPTIONKEY: 'key7', iV: 'iv7', ISLOGGEDIN: true, authenticationkey: 'auth7', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: '2023-06-01', ISLOCKED: false, UNLOCKEDTIME: '', VALUE3: 'v3_7', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-02-20', UPDATEDATE: '2023-02-20' },
  { ID: '8',  FULLNAME: 'Diana Prince', ROLE: 'Sales', STATUS: 'Pending', ACCOUNTNUMBER: 'ACC004', ACCOUNTTYPE: 'TypeC', PHONENUMBER: '888-999-0000', DEVICENAME: 'Device8', ENCRYPTIONKEY: 'key8', iV: 'iv8', ISLOGGEDIN: false, authenticationkey: 'auth8', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: '2023-06-01', ISLOCKED: false, UNLOCKEDTIME: '', VALUE3: 'v3_8', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: '2023-04-05', UPDATEDATE: '2023-04-05' },
];

const MOCK_BRANCH_USERS: BranchUser[] = [
  { id: '1', name: 'John Doe', email: 'john.d@branch.com', branch: 'Downtown Branch', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.s@branch.com', branch: 'Uptown Branch', status: 'Active' },
  { id: '3', name: 'Peter Jones', email: 'peter.j@branch.com', branch: 'Downtown Branch', status: 'Inactive' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@branch.com', branch: 'Westside Branch', status: 'Pending' },
  { id: '5', name: 'David Williams', email: 'david.w@branch.com', branch: 'Uptown Branch', status: 'Active' },
];

const MOCK_DAILY_BALANCES: merchants_daily_balances[] = [
  { ID: '1', MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', DAILYBALANCE: 1500.75, DAILYTXNCOUNT: 25, BALANCEDATE: '2023-06-01', INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: '2', MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', DAILYBALANCE: 1800.50, DAILYTXNCOUNT: 30, BALANCEDATE: '2023-06-02', INSERTDATE: '2023-06-02', UPDATEDATE: '2023-06-02', INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: '3', MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', DAILYBALANCE: 3200.00, DAILYTXNCOUNT: 50, BALANCEDATE: '2023-06-01', INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: '4', MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', DAILYBALANCE: 2950.25, DAILYTXNCOUNT: 45, BALANCEDATE: '2023-06-02', INSERTDATE: '2023-06-02', UPDATEDATE: '2023-06-02', INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: '5', MERCHANTACCOUNT: 'ACC004', MERCHANTPHONE: '444-555-6666', DAILYBALANCE: 500.00, DAILYTXNCOUNT: 10, BALANCEDATE: '2023-06-01', INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_MERCHANT_TXNS: merchant_txns[] = [
    { ID: 'txn_1', MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', AMOUNT: 50.25, TXNID: 'TXN001', CUSTOMERNAME: 'Customer A', CUSTOMERACCOUNT: 'CUST001', T24USER: 't24user1', T2TRANSACTIONDATE: '2023-06-01T10:00:00Z', STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: 'txn_2', MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', AMOUNT: 15.00, TXNID: 'TXN002', CUSTOMERNAME: 'Customer B', CUSTOMERACCOUNT: 'CUST002', T24USER: 't24user1', T2TRANSACTIONDATE: '2023-06-01T11:30:00Z', STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: 'txn_3', MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', AMOUNT: 200.00, TXNID: 'TXN003', CUSTOMERNAME: 'Customer C', CUSTOMERACCOUNT: 'CUST003', T24USER: 't24user2', T2TRANSACTIONDATE: '2023-06-01T12:00:00Z', STATUS: 'Pending', TRANSACTIONCHANNEL: 'Online', TRANSACTIONSERVICE: 'Transfer', VALUE1: 'Note A', VALUE2: null, VALUE3: null, INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: 'txn_4', MERCHANTACCOUNT: 'ACC004', MERCHANTPHONE: '444-555-6666', AMOUNT: 75.50, TXNID: 'TXN004', CUSTOMERNAME: 'Customer D', CUSTOMERACCOUNT: 'CUST004', T24USER: 't24user3', T2TRANSACTIONDATE: '2023-06-01T14:00:00Z', STATUS: 'Failed', TRANSACTIONCHANNEL: 'POS', TRANSACTIONSERVICE: 'Purchase', VALUE1: 'Error X', VALUE2: 'Retry 1', VALUE3: null, INSERTDATE: '2023-06-01', UPDATEDATE: '2023-06-01', INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: 'txn_5', MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', AMOUNT: 500.00, TXNID: 'TXN005', CUSTOMERNAME: 'Customer E', CUSTOMERACCOUNT: 'CUST005', T24USER: 't24user2', T2TRANSACTIONDATE: '2023-06-02T09:00:00Z', STATUS: 'Completed', TRANSACTIONCHANNEL: 'Online', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: '2023-06-02', UPDATEDATE: '2023-06-02', INSERTUSER: 'system', UPDATEUSER: 'system' },
]


const MOCK_CURRENT_USER: BranchUser = MOCK_BRANCH_USERS[0];

type DataContextType = {
  branches: Branch[];
  allowedCompanies: allowed_companies[];
  merchants: Merchant_users[];
  branchUsers: BranchUser[];
  dailyBalances: merchants_daily_balances[];
  merchantTxns: merchant_txns[];
  currentUser: BranchUser;
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => void;
  updateAllowedCompany: (company: allowed_companies) => void;
  updateMerchant: (merchant: Merchant_users) => void;
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
  const [allowedCompanies, setAllowedCompanies] = React.useState<allowed_companies[]>(MOCK_ALLOWED_COMPANIES);
  const [merchants, setMerchants] = React.useState<Merchant_users[]>(MOCK_MERCHANT_USERS);
  const [branchUsers, setBranchUsers] = React.useState<BranchUser[]>(MOCK_BRANCH_USERS);
  const [dailyBalances, setDailyBalances] = React.useState<merchants_daily_balances[]>(MOCK_DAILY_BALANCES);
  const [merchantTxns, setMerchantTxns] = React.useState<merchant_txns[]>(MOCK_MERCHANT_TXNS);
  const [currentUser, setCurrentUser] = React.useState<BranchUser>(MOCK_CURRENT_USER);

  const addBranch = (branch: Branch) => setBranches(prev => [...prev, branch]);
  const updateBranch = (updatedBranch: Branch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };

  const addAllowedCompany = (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => {
    const now = new Date().toISOString();
    const newIdNumber = Math.max(...allowedCompanies.map(c => parseInt(c.ID.replace('C', ''), 10)), 0) + 1;
    const newId = `C${newIdNumber.toString().padStart(3, '0')}`;
    const newOid = `oid_${newId}`;

    const newCompany: allowed_companies = {
        ...company,
        ID: newId,
        Oid: newOid,
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
  const updateAllowedCompany = (updatedCompany: allowed_companies) => {
    setAllowedCompanies(prev => prev.map(c => c.Oid === updatedCompany.Oid ? {...updatedCompany, UPDATEDATE: new Date().toISOString(), UPDATEUSER: currentUser.name} : c));
  };
  
  const updateMerchant = (updatedMerchant: Merchant_users) => {
    setMerchants(prev => prev.map(m => m.ID === updatedMerchant.ID ? updatedMerchant : m));
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
    setMerchants(prev => prev.map(m => m.ID === merchantId ? { ...m, STATUS: status } : m));
  };
  
  const updateBranchUserStatus = (userId: string, status: 'Active' | 'Inactive') => {
    setBranchUsers(prev => prev.map(user => user.id === userId ? { ...user, status } : user));
  };

  const value = {
    branches,
    allowedCompanies,
    merchants,
    branchUsers,
    dailyBalances,
    merchantTxns,
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
