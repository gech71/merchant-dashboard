

'use client';

import * as React from 'react';
import type { Branch, allowed_companies, Merchant_users, BranchUser, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, qr_payments, account_infos, promo_adds, role_capablities } from '@/types';

type CurrentUser = {
    userId: string;
    role: string;
    name: string;
    email: string;
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
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => Promise<void>;
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
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);

  const addBranch = (branch: Branch) => setBranches(prev => [...prev, branch]);
  const updateBranch = (updatedBranch: Branch) => {
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
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
            APPROVEUSER: isApproved ? currentUser?.name : null
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
