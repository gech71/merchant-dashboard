
'use client';

import * as React from 'react';
import type { allowed_companies, Merchant_users, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, qr_payments, account_infos, promo_adds, Roles, role_capablities, SystemUser, Branch } from '@/types';

type CurrentUser = {
    userId: string;
    userType: 'merchant' | 'system';
    role: string;
    name: string;
    email: string;
    accountNumber?: string | null;
    permissions: string[];
};

type InitialData = {
    allowedCompanies: allowed_companies[];
    merchants: Merchant_users[];
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
    roleCapabilities: role_capablities[];
    systemUsers: SystemUser[];
    branches: Branch[];
}

type DataContextType = Omit<InitialData, 'merchants' | 'roles' | 'systemUsers'> & {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  merchants: Merchant_users[];
  roles: Roles[];
  systemUsers: SystemUser[];
  addRole: (role: Omit<Roles, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'capabilities' | 'permissions'> & { pages: string[] }) => Promise<void>;
  updateRole: (role: { id: string; ROLENAME: string; description?: string | null; pages: string[] }) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord' | 'branchName'>) => Promise<void>;
  updateAllowedCompany: (company: allowed_companies) => Promise<void>;
  updateMerchant: (merchant: Merchant_users) => Promise<void>;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => Promise<void>;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => Promise<void>;
  updateSystemUser: (user: SystemUser) => Promise<void>;
  updateSystemUserStatus: (userId: string, status: 'Active' | 'Inactive') => Promise<void>;
  addSystemUser: (user: Omit<SystemUser, 'id' | 'role'>) => Promise<void>;
  updateUserRole: (userId: string, roleId: string, userType: 'merchant' | 'system') => Promise<void>;
  addBranch: (branch: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => Promise<void>;
  updateBranch: (branch: Branch) => Promise<void>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [allowedCompanies, setAllowedCompanies] = React.useState(initialData.allowedCompanies);
  const [merchants, setMerchants] = React.useState(initialData.merchants);
  const [roles, setRoles] = React.useState<Roles[]>(initialData.roles);
  const [systemUsers, setSystemUsers] = React.useState<SystemUser[]>(initialData.systemUsers);
  const [branches, setBranches] = React.useState<Branch[]>(initialData.branches);


  React.useEffect(() => {
    const fetchUser = async () => {
        setLoading(true);
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
  
  const userAccountNumber = currentUser?.userType === 'merchant' ? currentUser?.accountNumber : null;
  const isMerchantAdmin = currentUser?.role === 'Admin';
  const isMerchantSales = currentUser?.role === 'Sales';
  const isSystemUser = currentUser?.userType === 'system';

  const filteredAllowedCompanies = React.useMemo(() => {
    if (userAccountNumber) {
        return initialData.allowedCompanies.filter(c => c.ACCOUNTNUMBER === userAccountNumber);
    }
    return initialData.allowedCompanies;
  }, [userAccountNumber, initialData.allowedCompanies]);

  const filteredMerchants = React.useMemo(() => {
      if (isSystemUser) {
        return initialData.merchants;
      }
      if (userAccountNumber) {
          if (isMerchantAdmin) {
              return initialData.merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber);
          }
          if (isMerchantSales) {
              return initialData.merchants.filter(m => m.ID === currentUser.userId);
          }
      }
      return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, isSystemUser, initialData.merchants]);

  const dailyBalances = React.useMemo(() => {
      if (isSystemUser) return initialData.dailyBalances;
      if (userAccountNumber) {
          return initialData.dailyBalances.filter(db => db.MERCHANTACCOUNT === userAccountNumber);
      }
      return [];
  }, [isSystemUser, userAccountNumber, initialData.dailyBalances]);


  const merchantTxns = React.useMemo(() => {
      if (isSystemUser) return initialData.merchantTxns;
      if (userAccountNumber) {
          if (isMerchantAdmin) {
              return initialData.merchantTxns.filter(txn => txn.MERCHANTACCOUNT === userAccountNumber);
          }
          if (isMerchantSales) {
              return initialData.merchantTxns.filter(txn => txn.MERCHANTPHONE === currentUser?.email);
          }
      }
      return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, isSystemUser, initialData.merchantTxns]);

  const arifRequests = React.useMemo(() => {
    if (isSystemUser) return initialData.arifRequests;
    if (userAccountNumber) {
        return initialData.arifRequests.filter(ar => ar.MERCHANTACCOUNT === userAccountNumber);
    }
    return [];
  }, [isSystemUser, userAccountNumber, initialData.arifRequests]);
  
  const paystreamTxns = React.useMemo(() => {
    if (isSystemUser) return initialData.paystreamTxns;
    if (userAccountNumber) {
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
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, isSystemUser, initialData.paystreamTxns, merchants]);

  const qrPayments = React.useMemo(() => {
    if (isSystemUser) return initialData.qrPayments;
    if (userAccountNumber) {
        const companySalerPhones = merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber).map(m => m.PHONENUMBER);
        if (isMerchantAdmin) {
            return initialData.qrPayments.filter(qp => qp.SALERPHONENUMBER && companySalerPhones.includes(qp.SALERPHONENUMBER));
        }
        if (isMerchantSales) {
            return initialData.qrPayments.filter(qp => qp.SALERPHONENUMBER === currentUser?.email);
        }
    }
    return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, isSystemUser, merchants, initialData.qrPayments]);

  const accountInfos = React.useMemo(() => {
    if (isSystemUser) return initialData.accountInfos;
    if (userAccountNumber) {
        const relatedAccounts = new Set(merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber).map(m => m.ACCOUNTNUMBER));
         if (isMerchantAdmin) {
            return initialData.accountInfos.filter(ai => ai.ACCOUNTNUMBER && relatedAccounts.has(ai.ACCOUNTNUMBER));
        }
        if (isMerchantSales) {
            return initialData.accountInfos.filter(ai => ai.PHONENUMBER === currentUser?.email || ai.ACCOUNTNUMBER === userAccountNumber);
        }
    }
    return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, isSystemUser, merchants, initialData.accountInfos]);
  

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
            APPROVED: false,
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
    const fullUser = merchants.find(m => m.ID === returnedUser.ID);
    if(fullUser) {
        setMerchants(prev => prev.map(m => m.ID === returnedUser.ID ? { ...fullUser, ...returnedUser } : m));
    }
  };
  
  const updateAllowedCompanyApproval = async (companyId: string, isApproved: boolean) => {
    const response = await fetch(`/api/allowed_companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            APPROVED: isApproved, 
            STATUS: isApproved
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
    const fullUser = merchants.find(m => m.ID === returnedUser.ID);
    if(fullUser) {
        setMerchants(prev => prev.map(m => m.ID === returnedUser.ID ? { ...fullUser, ...returnedUser } : m));
    }
  };

  const addRole = async (role: Omit<Roles, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'capabilities' | 'permissions'> & { pages: string[] }) => {
    const response = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error('Failed to create role');
    const newRole = await response.json();
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = async (role: { id: string; ROLENAME: string; description?: string | null; pages: string[] }) => {
    const response = await fetch(`/api/roles/${role.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(role),
    });
    if (!response.ok) throw new Error('Failed to update role');
    const updatedRole = await response.json();
    setRoles(prev => prev.map(r => r.ID === updatedRole.ID ? updatedRole : r));
  };

  const deleteRole = async (roleId: string) => {
    const response = await fetch(`/api/roles/${roleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete role');
    setRoles(prev => prev.filter(r => r.ID !== roleId));
  };

  const addSystemUser = async (user: Omit<SystemUser, 'id' | 'role'>) => {
    const response = await fetch('/api/system-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add system user');
    }
    const newUser = await response.json();
    setSystemUsers(prev => [...prev, newUser]);
  };

  const updateSystemUser = async (user: SystemUser) => {
    const response = await fetch(`/api/system-users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to update system user');
    const updatedUser = await response.json();
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateSystemUserStatus = async (userId: string, status: 'Active' | 'Inactive') => {
    const response = await fetch(`/api/system-users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update user status');
    const updatedUser = await response.json();
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const updateUserRole = async (userId: string, roleId: string, userType: 'merchant' | 'system') => {
    const response = await fetch('/api/user-roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, roleId, userType }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    const updatedUser = await response.json();

    if (userType === 'merchant') {
      const fullUser = merchants.find(m => m.ID === updatedUser.ID);
      if(fullUser) {
        setMerchants(prev => prev.map(m => m.ID === updatedUser.ID ? { ...fullUser, ...updatedUser } : m));
      }
    } else {
      setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  };

  const addBranch = async (branch: Omit<Branch, 'id' | 'status' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord'>) => {
    const response = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branch),
    });
    if (!response.ok) throw new Error('Failed to add branch');
    const newBranch = await response.json();
    setBranches(prev => [...prev, newBranch]);
  };
  
  const updateBranch = async (branch: Branch) => {
    const response = await fetch(`/api/branches/${branch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branch),
    });
    if (!response.ok) throw new Error('Failed to update branch');
    const updatedBranch = await response.json();
    setBranches(prev => prev.map(b => b.id === updatedBranch.id ? updatedBranch : b));
  };


  const value: DataContextType = {
    ...initialData,
    allowedCompanies: filteredAllowedCompanies,
    merchants: filteredMerchants,
    dailyBalances,
    merchantTxns,
    arifRequests,
    paystreamTxns,
    qrPayments,
    accountInfos,
    roles,
    systemUsers,
    branches,
    currentUser,
    setCurrentUser,
    addAllowedCompany,
    updateAllowedCompany,
    updateMerchant,
    updateAllowedCompanyApproval,
    updateMerchantStatus,
    addRole,
    updateRole,
    deleteRole,
    addSystemUser,
    updateSystemUser,
    updateSystemUserStatus,
    updateUserRole,
    addBranch,
    updateBranch,
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
