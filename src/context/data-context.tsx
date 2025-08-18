
'use client';

import * as React from 'react';
import type { Branch, allowed_companies, Merchant_users, BranchUser, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, qr_payments, account_infos, promo_adds, Roles } from '@/types';

type CurrentUser = {
    userId: string;
    userType: 'merchant' | 'branch';
    role: string;
    name: string;
    email: string;
    accountNumber: string | null;
    branch: string | null;
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
    roles: Roles[];
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
  roles: Roles[];
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE' | 'BranchUser'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord' | 'branchName'>) => Promise<void>;
  updateAllowedCompany: (company: allowed_companies) => Promise<void>;
  updateMerchant: (merchant: Merchant_users) => Promise<void>;
  addBranchUser: (user: Omit<BranchUser, 'id' | 'status' | 'password' | 'roleId' | 'role' >) => Promise<void>;
  updateBranchUser: (user: BranchUser) => Promise<void>;
  updateBranchStatus: (branchId: string, status: 'Approved' | 'Rejected') => void;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => Promise<void>;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => Promise<void>;
  updateBranchUserStatus: (userId: string, status: 'Active' | 'Inactive') => Promise<void>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [allowedCompanies, setAllowedCompanies] = React.useState(initialData.allowedCompanies);
  const [branchUsers, setBranchUsers] = React.useState(initialData.branchUsers);
  const [merchants, setMerchants] = React.useState(initialData.merchants);
  const [branches, setBranches] = React.useState(initialData.branches);
  const [roles, setRoles] = React.useState<Roles[]>(initialData.roles);


  React.useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const user = await response.json();
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user', error);
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };
    fetchUser();
}, []);

  const isSystemAdmin = currentUser?.role === 'System Admin';
  const isBranchUser = currentUser?.userType === 'branch';
  const userAccountNumber = currentUser?.accountNumber;
  const isMerchantAdmin = currentUser?.role === 'Admin';
  const isMerchantSales = currentUser?.role === 'Sales';


  const filteredBranches = React.useMemo(() => branches.filter(b => isSystemAdmin || (isBranchUser && b.name === currentUser?.branch)), [isSystemAdmin, isBranchUser, currentUser, branches]);
  
  const filteredAllowedCompanies = React.useMemo(() => {
    if (isSystemAdmin || isBranchUser) return allowedCompanies;
    if (currentUser?.userType === 'merchant') return allowedCompanies.filter(c => c.ACCOUNTNUMBER === userAccountNumber);
    return [];
  }, [isSystemAdmin, isBranchUser, userAccountNumber, allowedCompanies, currentUser]);

  const filteredMerchants = React.useMemo(() => {
      if (currentUser?.userType === 'branch') {
          return merchants;
      }
      if (currentUser?.userType === 'merchant') {
          if (isMerchantAdmin) {
              return merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber);
          }
          if (isMerchantSales) {
              return merchants.filter(m => m.ID === currentUser.userId);
          }
      }
      return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, merchants]);

  const filteredBranchUsers = React.useMemo(() => {
      if (isSystemAdmin) return branchUsers;
      if (isBranchUser) {
          return branchUsers.filter(bu => bu.branch === currentUser?.branch);
      }
      return [];
  }, [isSystemAdmin, isBranchUser, currentUser, branchUsers]);

  const dailyBalances = React.useMemo(() => {
      if (currentUser?.userType === 'branch') {
          return initialData.dailyBalances;
      }
      if (currentUser?.userType === 'merchant') {
          return initialData.dailyBalances.filter(db => db.MERCHANTACCOUNT === userAccountNumber);
      }
      return [];
  }, [currentUser, userAccountNumber, initialData.dailyBalances]);


  const merchantTxns = React.useMemo(() => {
      if (currentUser?.userType === 'branch') {
          return initialData.merchantTxns;
      }
      if (currentUser?.userType === 'merchant') {
          if (isMerchantAdmin) {
              return initialData.merchantTxns.filter(txn => txn.MERCHANTACCOUNT === userAccountNumber);
          }
          if (isMerchantSales) {
              return initialData.merchantTxns.filter(txn => txn.MERCHANTPHONE === currentUser.email);
          }
      }
      return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, initialData.merchantTxns]);

  const arifRequests = React.useMemo(() => {
     if (currentUser?.userType === 'branch') return initialData.arifRequests;
    if (currentUser?.userType === 'merchant') {
        return initialData.arifRequests.filter(ar => ar.MERCHANTACCOUNT === userAccountNumber);
    }
    return [];
  }, [currentUser, userAccountNumber, initialData.arifRequests]);
  
  const arifpayEndpoints = React.useMemo(() => isSystemAdmin ? initialData.arifpayEndpoints : [], [isSystemAdmin, initialData.arifpayEndpoints]);
  const controllersConfigs = React.useMemo(() => isSystemAdmin ? initialData.controllersConfigs : [], [isSystemAdmin, initialData.controllersConfigs]);
  const coreIntegrationSettings = React.useMemo(() => isSystemAdmin ? initialData.coreIntegrationSettings : [], [isSystemAdmin, initialData.coreIntegrationSettings]);
  const streamPaySettings = React.useMemo(() => isSystemAdmin ? initialData.streamPaySettings : [], [isSystemAdmin, initialData.streamPaySettings]);
  const ussdPushSettings = React.useMemo(() => isSystemAdmin ? initialData.ussdPushSettings : [], [isSystemAdmin, initialData.ussdPushSettings]);
  
  const paystreamTxns = React.useMemo(() => {
    if (currentUser?.userType === 'branch') return initialData.paystreamTxns;
    if (currentUser?.userType === 'merchant') {
        if (isMerchantAdmin) {
            return initialData.paystreamTxns.filter(pt => pt.MERCHANTACCOUNTNUMBER === userAccountNumber);
        }
        if (isMerchantSales) {
            const user = merchants.find(m => m.ID === currentUser?.userId);
            if (user) {
                return initialData.paystreamTxns.filter(pt => pt.SALERPHONENUMBER === user.PHONENUMBER);
            }
        }
    }
    return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, initialData.paystreamTxns, merchants]);

  const qrPayments = React.useMemo(() => {
    if (currentUser?.userType === 'branch') return initialData.qrPayments;
    if (currentUser?.userType === 'merchant') {
        const companySalerPhones = merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber).map(m => m.PHONENUMBER);
        if (isMerchantAdmin) {
            return initialData.qrPayments.filter(qp => qp.SALERPHONENUMBER && companySalerPhones.includes(qp.SALERPHONENUMBER));
        }
        if (isMerchantSales) {
            return initialData.qrPayments.filter(qp => qp.SALERPHONENUMBER === currentUser?.email);
        }
    }
    return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, merchants, initialData.qrPayments]);

  const accountInfos = React.useMemo(() => {
    if (currentUser?.userType === 'branch') return initialData.accountInfos;
    if (currentUser?.userType === 'merchant') {
        const relatedAccounts = new Set(merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber).map(m => m.ACCOUNTNUMBER));
         if (isMerchantAdmin) {
            return initialData.accountInfos.filter(ai => relatedAccounts.has(ai.ACCOUNTNUMBER));
        }
        if (isMerchantSales) {
            return initialData.accountInfos.filter(ai => ai.PHONENUMBER === currentUser?.email || ai.ACCOUNTNUMBER === userAccountNumber);
        }
    }
    return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, merchants, initialData.accountInfos]);
  
  const promoAdds = initialData.promoAdds;


  const addBranch = async (branchData: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE' | 'BranchUser'>) => {
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

  const addAllowedCompany = async (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord' | 'branchName'>) => {
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

  const updateAllowedCompany = async (updatedCompany: allowed_companies) => {
    const response = await fetch(`/api/allowed_companies/${updatedCompany.Oid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            APPROVED: false, // Set to false to trigger re-approval
            STATUS: false,
            FIELDNAME: updatedCompany.FIELDNAME,
            ACCOUNTNUMBER: updatedCompany.ACCOUNTNUMBER
        })
    });
     if (!response.ok) {
        throw new Error('Failed to update company');
    }
    const returnedCompany = await response.json();
    setAllowedCompanies(prev => prev.map(c => c.Oid === returnedCompany.Oid ? returnedCompany : c));
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

  const addBranchUser = async (userData: Omit<BranchUser, 'id' | 'status' | 'password' | 'roleId' | 'role'>) => {
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

  const updateBranchStatus = (branchId: string, status: 'Approved' | 'Rejected') => {
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
            STATUS: isApproved // On rejection, STATUS also becomes false
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
  
  const updateBranchUserStatus = async (userId: string, status: 'Active' | 'Inactive') => {
    const user = branchUsers.find(u => u.id === userId);
    if (user) {
        await updateBranchUser({ ...user, status });
    }
  };


  const value = {
    branches: filteredBranches,
    allowedCompanies: filteredAllowedCompanies,
    merchants: filteredMerchants,
    branchUsers: filteredBranchUsers,
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
  };

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = React.useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}
