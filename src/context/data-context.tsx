
'use client';

import * as React from 'react';
import type { allowed_companies, Merchant_users, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, qr_payments, account_infos, promo_adds, Roles, role_capablities } from '@/types';

type CurrentUser = {
    userId: string;
    userType: 'merchant';
    role: string;
    name: string;
    email: string;
    accountNumber: string | null;
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
}

type DataContextType = Omit<InitialData, 'roles'> & {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  roles: Roles[];
  addRole: (role: Omit<Roles, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'capabilities' | 'permissions'> & { pages: string[] }) => Promise<void>;
  updateRole: (role: { id: string; ROLENAME: string; description?: string | null; pages: string[] }) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord' | 'branchName'>) => Promise<void>;
  updateAllowedCompany: (company: allowed_companies) => Promise<void>;
  updateMerchant: (merchant: Merchant_users) => Promise<void>;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => Promise<void>;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => Promise<void>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [allowedCompanies, setAllowedCompanies] = React.useState(initialData.allowedCompanies);
  const [merchants, setMerchants] = React.useState(initialData.merchants);
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
  
  const userAccountNumber = currentUser?.accountNumber;
  const isMerchantAdmin = currentUser?.role === 'Admin';
  const isMerchantSales = currentUser?.role === 'Sales';

  const filteredAllowedCompanies = React.useMemo(() => {
    if (currentUser?.userType === 'merchant') {
        if (isMerchantAdmin) return allowedCompanies; // Admin sees all
        return allowedCompanies.filter(c => c.ACCOUNTNUMBER === userAccountNumber);
    }
    return [];
  }, [userAccountNumber, isMerchantAdmin, allowedCompanies, currentUser]);

  const filteredMerchants = React.useMemo(() => {
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

  const dailyBalances = React.useMemo(() => {
      if (currentUser?.userType === 'merchant') {
          return initialData.dailyBalances.filter(db => db.MERCHANTACCOUNT === userAccountNumber);
      }
      return [];
  }, [currentUser, userAccountNumber, initialData.dailyBalances]);


  const merchantTxns = React.useMemo(() => {
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
    if (currentUser?.userType === 'merchant') {
        return initialData.arifRequests.filter(ar => ar.MERCHANTACCOUNT === userAccountNumber);
    }
    return [];
  }, [currentUser, userAccountNumber, initialData.arifRequests]);
  
  const arifpayEndpoints = React.useMemo(() => isMerchantAdmin ? initialData.arifpayEndpoints : [], [isMerchantAdmin, initialData.arifpayEndpoints]);
  const controllersConfigs = React.useMemo(() => isMerchantAdmin ? initialData.controllersConfigs : [], [isMerchantAdmin, initialData.controllersConfigs]);
  const coreIntegrationSettings = React.useMemo(() => isMerchantAdmin ? initialData.coreIntegrationSettings : [], [isMerchantAdmin, initialData.coreIntegrationSettings]);
  const streamPaySettings = React.useMemo(() => isMerchantAdmin ? initialData.streamPaySettings : [], [isMerchantAdmin, initialData.streamPaySettings]);
  const ussdPushSettings = React.useMemo(() => isMerchantAdmin ? initialData.ussdPushSettings : [], [isMerchantAdmin, initialData.ussdPushSettings]);
  
  const paystreamTxns = React.useMemo(() => {
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
    if (currentUser?.userType === 'merchant') {
        const relatedAccounts = new Set(merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber).map(m => m.ACCOUNTNUMBER));
         if (isMerchantAdmin) {
            return initialData.accountInfos.filter(ai => ai.ACCOUNTNUMBER && relatedAccounts.has(ai.ACCOUNTNUMBER));
        }
        if (isMerchantSales) {
            return initialData.accountInfos.filter(ai => ai.PHONENUMBER === currentUser?.email || ai.ACCOUNTNUMBER === userAccountNumber);
        }
    }
    return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, merchants, initialData.accountInfos]);
  
  const promoAdds = initialData.promoAdds;
  const roleCapabilities = isMerchantAdmin ? initialData.roleCapabilities : [];

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
    setMerchants(prev => prev.map(m => m.ID === returnedUser.ID ? returnedUser : m));
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
    setMerchants(prev => prev.map(m => m.ID === returnedUser.ID ? returnedUser : m));
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

  const value: DataContextType = {
    ...initialData,
    allowedCompanies: filteredAllowedCompanies,
    merchants: filteredMerchants,
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
    addAllowedCompany,
    updateAllowedCompany,
    updateMerchant,
    updateAllowedCompanyApproval,
    updateMerchantStatus,
    addRole,
    updateRole,
    deleteRole,
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
