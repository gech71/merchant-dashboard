
'use client';

import * as React from 'react';
import type { Branch, allowed_companies, Merchant_users, BranchUser, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, qr_payments, account_infos, promo_adds, role_capablities, DashBoardRoles } from '@/types';

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
    roleCapabilities: role_capablities[];
    roles: DashBoardRoles[];
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
  roles: DashBoardRoles[];
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  addBranch: (branch: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord' | 'branchName'>) => Promise<void>;
  updateAllowedCompany: (company: allowed_companies) => void;
  updateMerchant: (merchant: Merchant_users) => Promise<void>;
  addBranchUser: (user: Omit<BranchUser, 'id' | 'status' | 'roleId' | 'DashBoardRoles' | 'password'>) => Promise<void>;
  updateBranchUser: (user: BranchUser) => Promise<void>;
  updateBranchStatus: (branchId: number, status: 'Approved' | 'Rejected') => void;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => Promise<void>;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => Promise<void>;
  updateBranchUserStatus: (userId: number, status: 'Active' | 'Inactive') => Promise<void>;
  addRole: (role: Omit<DashBoardRoles, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRole: (role: DashBoardRoles) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  updateUserRole: (userId: string, roleId: string, userType: 'merchant' | 'branch') => Promise<void>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [loading, setLoading] = React.useState(true);

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

  const branches = React.useMemo(() => isSystemAdmin ? initialData.branches : [], [isSystemAdmin, initialData.branches]);
  
  const allowedCompanies = React.useMemo(() => {
    if (isSystemAdmin) return initialData.allowedCompanies;
    if (currentUser?.userType === 'branch') {
        return initialData.allowedCompanies.filter(c => c.branchName === currentUser.branch);
    }
    if (userAccountNumber) return initialData.allowedCompanies.filter(c => c.ACCOUNTNUMBER === userAccountNumber);
    return [];
  }, [isSystemAdmin, userAccountNumber, currentUser, initialData.allowedCompanies]);

  const merchants = React.useMemo(() => {
    if (isSystemAdmin) return initialData.merchants;
    if (userAccountNumber) return initialData.merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber);
    return [];
  }, [isSystemAdmin, userAccountNumber, initialData.merchants]);

  const branchUsers = React.useMemo(() => isSystemAdmin ? initialData.branchUsers : [], [isSystemAdmin, initialData.branchUsers]);

  const dailyBalances = React.useMemo(() => {
    if (isSystemAdmin) return initialData.dailyBalances;
    if (userAccountNumber) return initialData.dailyBalances.filter(db => db.MERCHANTACCOUNT === userAccountNumber);
    return [];
  }, [isSystemAdmin, userAccountNumber, initialData.dailyBalances]);

  const merchantTxns = React.useMemo(() => {
    if (isSystemAdmin) return initialData.merchantTxns;
    if (userAccountNumber) return initialData.merchantTxns.filter(txn => txn.MERCHANTACCOUNT === userAccountNumber);
    return [];
  }, [isSystemAdmin, userAccountNumber, initialData.merchantTxns]);

  const arifRequests = React.useMemo(() => {
     if (isSystemAdmin) return initialData.arifRequests;
    if (userAccountNumber) return initialData.arifRequests.filter(ar => ar.MERCHANTACCOUNT === userAccountNumber);
    return [];
  }, [isSystemAdmin, userAccountNumber, initialData.arifRequests]);
  
  // These are system-level and should probably only be visible to system admins
  const arifpayEndpoints = React.useMemo(() => isSystemAdmin ? initialData.arifpayEndpoints : [], [isSystemAdmin, initialData.arifpayEndpoints]);
  const controllersConfigs = React.useMemo(() => isSystemAdmin ? initialData.controllersConfigs : [], [isSystemAdmin, initialData.controllersConfigs]);
  const coreIntegrationSettings = React.useMemo(() => isSystemAdmin ? initialData.coreIntegrationSettings : [], [isSystemAdmin, initialData.coreIntegrationSettings]);
  const streamPaySettings = React.useMemo(() => isSystemAdmin ? initialData.streamPaySettings : [], [isSystemAdmin, initialData.streamPaySettings]);
  const ussdPushSettings = React.useMemo(() => isSystemAdmin ? initialData.ussdPushSettings : [], [isSystemAdmin, initialData.ussdPushSettings]);
  const roleCapabilities = React.useMemo(() => isSystemAdmin ? initialData.roleCapabilities : [], [isSystemAdmin, initialData.roleCapabilities]);
  
  // Roles should be visible to system admins for management
  const [roles, setRoles] = React.useState<DashBoardRoles[]>(initialData.roles);


  const paystreamTxns = React.useMemo(() => {
    if (isSystemAdmin) return initialData.paystreamTxns;
    if (userAccountNumber) return initialData.paystreamTxns.filter(pt => pt.MERCHANTACCOUNTNUMBER === userAccountNumber);
    return [];
  }, [isSystemAdmin, userAccountNumber, initialData.paystreamTxns]);

  const qrPayments = React.useMemo(() => {
    if (isSystemAdmin) return initialData.qrPayments;
    // QR payments don't have a direct company link, filtering by sales phone
    const companySalesPhones = new Set(merchants.map(m => m.PHONENUMBER));
    return initialData.qrPayments.filter(qp => companySalesPhones.has(qp.SALERPHONENUMBER));
  }, [isSystemAdmin, merchants, initialData.qrPayments]);

  const accountInfos = React.useMemo(() => {
    if (isSystemAdmin) return initialData.accountInfos;
    if (userAccountNumber) {
        const relatedAccounts = new Set([userAccountNumber, ...merchants.map(m => m.ACCOUNTNUMBER)]);
        return initialData.accountInfos.filter(ai => relatedAccounts.has(ai.ACCOUNTNUMBER));
    }
    return [];
  }, [isSystemAdmin, userAccountNumber, merchants, initialData.accountInfos]);
  
  // Promo adds are likely global
  const promoAdds = initialData.promoAdds;


  const addBranch = async (branchData: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE'>) => {
    const response = await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(branchData),
    });
    if (!response.ok) throw new Error('Failed to create branch');
    const newBranch = await response.json();
    initialData.branches.push(newBranch);
  };

  const updateBranch = async (updatedBranch: Branch) => {
    const response = await fetch(`/api/branches/${updatedBranch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBranch)
    });
    if (!response.ok) throw new Error('Failed to update branch');
    const returnedBranch = await response.json();
    const index = initialData.branches.findIndex(b => b.id === returnedBranch.id);
    if (index !== -1) initialData.branches[index] = returnedBranch;
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
    initialData.allowedCompanies.push(newCompany);
  };

  const updateAllowedCompany = (updatedCompany: allowed_companies) => {
    const index = initialData.allowedCompanies.findIndex(c => c.Oid === updatedCompany.Oid);
    if(index !== -1) initialData.allowedCompanies[index] = {...updatedCompany, UPDATEDATE: new Date().toISOString(), UPDATEUSER: currentUser?.name || 'system'};
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
    const index = initialData.merchants.findIndex(m => m.ID === returnedUser.ID);
    if (index !== -1) initialData.merchants[index] = returnedUser;
  };

  const addBranchUser = async (userData: Omit<BranchUser, 'id' | 'status' | 'roleId' | 'DashBoardRoles' | 'password'>) => {
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
    initialData.branchUsers.push(newUser);
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
    const index = initialData.branchUsers.findIndex(u => u.id === returnedUser.id);
    if (index !== -1) initialData.branchUsers[index] = returnedUser;
  };

  const updateBranchStatus = (branchId: number, status: 'Approved' | 'Rejected') => {
    const branch = initialData.branches.find(b => b.id === branchId);
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
            STATUS: isApproved // Automatically set to active on approval
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to update company approval status');
    }
    const updatedCompany = await response.json();
    const index = initialData.allowedCompanies.findIndex(c => c.Oid === updatedCompany.Oid);
    if (index !== -1) initialData.allowedCompanies[index] = updatedCompany;
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
    const index = initialData.merchants.findIndex(m => m.ID === returnedUser.ID);
    if (index !== -1) initialData.merchants[index] = returnedUser;
  };
  
  const updateBranchUserStatus = async (userId: number, status: 'Active' | 'Inactive') => {
    const user = initialData.branchUsers.find(u => u.id === userId);
    if (user) {
        await updateBranchUser({ ...user, status });
    }
  };

  const addRole = async (roleData: Omit<DashBoardRoles, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/dashboard-roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) throw new Error('Failed to create role');
    const newRole = await response.json();
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = async (roleData: DashBoardRoles) => {
    const response = await fetch(`/api/dashboard-roles/${roleData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData),
    });
    if (!response.ok) throw new Error('Failed to update role');
    const updatedRole = await response.json();
    setRoles(prev => prev.map(r => r.id === updatedRole.id ? updatedRole : r));
  };

  const deleteRole = async (roleId: string) => {
    const response = await fetch(`/api/dashboard-roles/${roleId}`, {
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
        const index = initialData.merchants.findIndex(u => u.ID === userId);
        if (index !== -1) initialData.merchants[index] = updatedUser;
    } else {
        const index = initialData.branchUsers.findIndex(u => u.id.toString() === userId);
        if (index !== -1) initialData.branchUsers[index] = updatedUser;
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
