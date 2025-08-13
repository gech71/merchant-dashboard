
'use client';

import * as React from 'react';
import type { Branch, allowed_companies, Merchant_users, BranchUser, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, qr_payments, account_infos, promo_adds, role_capablities, Role } from '@/types';

type CurrentUser = {
    userId: string;
    role: string;
    name: string;
    email: string;
    permissions: string[];
};

type InitialData = {
    branches: Branch[];
    allowedCompanies: allowed_companies[];
    merchants: Merchant_users[];
    branchUsers: BranchUser[];
    dailyBalances: merchants_daily_balances[];
    merchantTxns: merchant_txns[];
    arifRequests: arif_requests[];
    arifpayEndpoints: arifpay_endpoints[];
    controllersConfigs: controllersconfigs[];
    coreIntegrationSettings: core_integration_settings[];
    paystreamTxns: paystream_txns[];
    streamPaySettings: stream_pay_settings[];
    ussdPushSettings: ussd_push_settings[];
    qrPayments: qr_payments[];
    accountInfos: account_infos[];
    promoAdds: promo_adds[];
    roleCapabilities: role_capablities[];
    roles: Role[];
}

type DataContextType = {
  branches: Branch[];
  allowedCompanies: allowed_companies[];
  merchants: Merchant_users[];
  branchUsers: BranchUser[];
  dailyBalances: merchants_daily_balances[];
  merchantTxns: merchant_txns[];
  arifRequests: arif_requests[];
  arifpayEndpoints: arifpay_endpoints[];
  controllersConfigs: controllersconfigs[];
  coreIntegrationSettings: core_integration_settings[];
  paystreamTxns: paystream_txns[];
  streamPaySettings: stream_pay_settings[];
  ussdPushSettings: ussd_push_settings[];
  qrPayments: qr_payments[];
  accountInfos: account_infos[];
  promoAdds: promo_adds[];
  roleCapabilities: role_capablities[];
  roles: Role[];
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => Promise<void>;
  updateAllowedCompany: (company: allowed_companies) => void;
  updateMerchant: (merchant: Merchant_users) => Promise<void>;
  addBranchUser: (user: Omit<BranchUser, 'id' | 'status'>) => Promise<void>;
  updateBranchUser: (user: BranchUser) => Promise<void>;
  updateBranchStatus: (branchId: number, status: 'Approved' | 'Rejected') => void;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => Promise<void>;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => Promise<void>;
  updateBranchUserStatus: (userId: number, status: 'Active' | 'Inactive') => Promise<void>;
  addRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRole: (role: Role) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  updateUserRole: (userId: string, roleId: string, userType: 'merchant' | 'branch') => Promise<void>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
  const [branches, setBranches] = React.useState<Branch[]>(initialData.branches);
  const [allowedCompanies, setAllowedCompanies] = React.useState<allowed_companies[]>(initialData.allowedCompanies);
  const [merchants, setMerchants] = React.useState<Merchant_users[]>(initialData.merchants);
  const [branchUsers, setBranchUsers] = React.useState<BranchUser[]>(initialData.branchUsers);
  const [dailyBalances, setDailyBalances] = React.useState<merchants_daily_balances[]>(initialData.dailyBalances);
  const [merchantTxns, setMerchantTxns] = React.useState<merchant_txns[]>(initialData.merchantTxns);
  const [arifRequests, setArifRequests] = React.useState<arif_requests[]>(initialData.arifRequests);
  const [arifpayEndpoints, setArifpayEndpoints] = React.useState<arifpay_endpoints[]>(initialData.arifpayEndpoints);
  const [controllersConfigs, setControllersConfigs] = React.useState<controllersconfigs[]>(initialData.controllersConfigs);
  const [coreIntegrationSettings, setCoreIntegrationSettings] = React.useState<core_integration_settings[]>(initialData.coreIntegrationSettings);
  const [paystreamTxns, setPaystreamTxns] = React.useState<paystream_txns[]>(initialData.paystreamTxns);
  const [streamPaySettings, setStreamPaySettings] = React.useState<stream_pay_settings[]>(initialData.streamPaySettings);
  const [ussdPushSettings, setUssdPushSettings] = React.useState<ussd_push_settings[]>(initialData.ussdPushSettings);
  const [qrPayments, setQrPayments] = React.useState<qr_payments[]>(initialData.qrPayments);
  const [accountInfos, setAccountInfos] = React.useState<account_infos[]>(initialData.accountInfos);
  const [promoAdds, setPromoAdds] = React.useState<promo_adds[]>(initialData.promoAdds);
  const [roleCapabilities, setRoleCapabilities] = React.useState<role_capablities[]>(initialData.roleCapabilities);
  const [roles, setRoles] = React.useState<Role[]>(initialData.roles);
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);

  const addBranch = async (branchData: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE'>) => {
    const response = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchData),
    });
    if (!response.ok) throw new Error('Failed to create branch');
    const newBranch = await response.json();
    setBranches(prev => [...prev, newBranch]);
  };

  const updateBranch = async (updatedBranch: Branch) => {
    const response = await fetch(`/api/branches/${updatedBranch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBranch)
    });
    if (!response.ok) throw new Error('Failed to update branch');
    const returnedBranch = await response.json();
    setBranches(prev => prev.map(b => b.id === returnedBranch.id ? returnedBranch : b));
  };

  const addAllowedCompany = async (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => {
    const response = await fetch('/api/allowed_companies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(company),
    });

    if (!response.ok) {
        throw new Error('Failed to add company');
    }

    const newCompany = await response.json();
    setAllowedCompanies(prev => [...prev, newCompany]);
  };

  const updateAllowedCompany = (updatedCompany: allowed_companies) => {
    setAllowedCompanies(prev => prev.map(c => c.Oid === updatedCompany.Oid ? {...updatedCompany, UPDATEDATE: new Date().toISOString(), UPDATEUSER: currentUser?.name || 'system'} : c));
  };
  
  const updateMerchant = async (updatedMerchant: Merchant_users) => {
     const response = await fetch(`/api/merchant_users/${updatedMerchant.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ROLE: updatedMerchant.ROLE }),
    });
    if (!response.ok) {
        throw new Error('Failed to update merchant user');
    }
    const returnedUser = await response.json();
    setMerchants(prev => prev.map(m => m.ID === returnedUser.ID ? returnedUser : m));
  };

  const addBranchUser = async (userData: Omit<BranchUser, 'id' | 'status'>) => {
    const response = await fetch('/api/branch-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create branch user');
    }
    const newUser = await response.json();
    setBranchUsers(prev => [...prev, newUser]);
  };

  const updateBranchUser = async (updatedUser: BranchUser) => {
    const response = await fetch(`/api/branch-users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
    });
     if (!response.ok) {
        throw new Error('Failed to update branch user');
    }
    const returnedUser = await response.json();
    setBranchUsers(prev => prev.map(u => u.id === returnedUser.id ? returnedUser : u));
  };

  const updateBranchStatus = (branchId: number, status: 'Approved' | 'Rejected') => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      updateBranch({ ...branch, status });
    }
  };
  
  const updateAllowedCompanyApproval = async (companyId: string, isApproved: boolean) => {
    const response = await fetch(`/api/allowed_companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            APPROVED: isApproved, 
            STATUS: isApproved ? 'Active' : 'Inactive'
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to update company approval status');
    }
    const updatedCompany = await response.json();
    setAllowedCompanies(prev => prev.map(c => c.Oid === updatedCompany.Oid ? updatedCompany : c));
  };

  const updateMerchantStatus = async (merchantId: string, status: 'Active' | 'Disabled') => {
    const response = await fetch(`/api/merchant_users/${merchantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ STATUS: status }),
    });
    if (!response.ok) {
        throw new Error('Failed to update merchant status');
    }
    const returnedUser = await response.json();
    setMerchants(prev => prev.map(m => m.ID === returnedUser.ID ? returnedUser : m));
  };
  
  const updateBranchUserStatus = async (userId: number, status: 'Active' | 'Inactive') => {
    const user = branchUsers.find(u => u.id === userId);
    if (user) {
        await updateBranchUser({ ...user, status });
    }
  };

  const addRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) throw new Error('Failed to create role');
    const newRole = await response.json();
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = async (roleData: Role) => {
    const response = await fetch(`/api/roles/${roleData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) throw new Error('Failed to update role');
    const updatedRole = await response.json();
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const deleteRole = async (roleId: string) => {
    const response = await fetch(`/api/roles/${roleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete role');
    setRoles(prev => prev.filter(r => r.id !== roleId));
  };

  const updateUserRole = async (userId: string, roleId: string, userType: 'merchant' | 'branch') => {
    const response = await fetch(`/api/user-roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, roleId, userType }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    const updatedUser = await response.json();
    if (userType === 'merchant') {
        setMerchants(prev => prev.map(u => u.ID === userId ? updatedUser : u));
    } else {
        setBranchUsers(prev => prev.map(u => u.id.toString() === userId ? updatedUser : u));
    }
  };


  const value = {
    branches,
    allowedCompanies,
    merchants,
    branchUsers,
    dailyBalances,
    merchantTxns,
    arifRequests,
    arifpayEndpoints,
    controllersConfigs,
    coreIntegrationSettings,
    paystreamTxns,
    streamPaySettings,
    ussdPushSettings,
    qrPayments,
    accountInfos,
    promoAdds,
    roleCapabilities,
    roles,
    currentUser,
    setCurrentUser,
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
    addRole,
    updateRole,
    deleteRole,
    updateUserRole,
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
