
'use client';

import * as React from 'react';
import type { allowed_companies, Merchant_users, merchants_daily_balances, merchant_txns, arif_requests, arifpay_endpoints, controllersconfigs, core_integration_settings, paystream_txns, stream_pay_settings, ussd_push_settings, account_infos, promo_adds, Roles, role_capablities, SystemUser, Branch, AuditLog } from '@/types';

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
    accountInfos: account_infos[];
    promoAdds: promo_adds[];
    roles: Roles[];
    roleCapabilities: role_capablities[];
    systemUsers: SystemUser[];
    auditLogs: AuditLog[];
}

type DataContextType = Omit<InitialData, 'systemUsers'> & {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  systemUsers: SystemUser[];
  addRole: (role: Omit<Roles, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'capabilities' | 'permissions' | 'SystemUsers' | 'Merchant_users'> & { pages: string[] }) => Promise<void>;
  updateRole: (role: { id: string; ROLENAME: string; description?: string | null; pages: string[] }) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  addAllowedCompany: (company: Omit<allowed_companies, 'ID' | 'Oid' | 'APPROVEUSER' | 'APPROVED' | 'STATUS' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER' | 'OptimisticLockField' | 'GCRecord' | 'branchName'>) => Promise<void>;
  updateAllowedCompany: (company: allowed_companies) => Promise<void>;
  updateMerchant: (merchant: Merchant_users) => Promise<void>;
  updateAllowedCompanyApproval: (companyId: string, isApproved: boolean) => Promise<void>;
  updateMerchantStatus: (merchantId: string, status: 'Active' | 'Disabled') => Promise<void>;
  updateSystemUser: (user: SystemUser) => Promise<void>;
  updateSystemUserStatus: (userId: string, status: 'Active' | 'Inactive') => Promise<void>;
  addSystemUser: (user: Omit<SystemUser, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUserRole: (userId: string, roleId: string, userType: 'merchant' | 'system') => Promise<void>;
  addRoleCapability: (capability: Omit<role_capablities, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSERID' | 'UPDATEUSERID'>) => Promise<void>;
  deleteRoleCapability: (id: string) => Promise<void>;
  updateRoleCapability: (capability: role_capablities) => Promise<void>;
  updateUssdPushSetting: (setting: ussd_push_settings) => Promise<void>;
  updateStreamPaySetting: (setting: stream_pay_settings) => Promise<void>;
  updateCoreIntegrationSetting: (setting: core_integration_settings) => Promise<void>;
  updateControllersConfig: (config: controllersconfigs) => Promise<void>;
  addArifpayEndpoint: (endpoint: Omit<arifpay_endpoints, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER'>) => Promise<void>;
  updateArifpayEndpoint: (endpoint: arifpay_endpoints) => Promise<void>;
  deleteArifpayEndpoint: (id: string) => Promise<void>;
  addPromoAd: (ad: Omit<promo_adds, 'ID' | 'INSERTUSERID' | 'UPDATEUSERID' | 'INSERTDATE' | 'UPDATEDATE'>) => Promise<void>;
  updatePromoAd: (ad: promo_adds) => Promise<void>;
  deletePromoAd: (id: string) => Promise<void>;
  restoreFromAuditLog: (auditLogId: string) => Promise<void>;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children, initialData }: { children: React.ReactNode, initialData: InitialData }) {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [allowedCompanies, setAllowedCompanies] = React.useState(initialData.allowedCompanies);
  const [merchants, setMerchants] = React.useState(initialData.merchants);
  const [roles, setRoles] = React.useState<Roles[]>(initialData.roles);
  const [systemUsers, setSystemUsers] = React.useState<SystemUser[]>(initialData.systemUsers);
  const [roleCapabilities, setRoleCapabilities] = React.useState<role_capablities[]>(initialData.roleCapabilities);
  const [ussdPushSettings, setUssdPushSettings] = React.useState<ussd_push_settings[]>(initialData.ussdPushSettings);
  const [streamPaySettings, setStreamPaySettings] = React.useState<stream_pay_settings[]>(initialData.streamPaySettings);
  const [coreIntegrationSettings, setCoreIntegrationSettings] = React.useState<core_integration_settings[]>(initialData.coreIntegrationSettings);
  const [controllersConfigs, setControllersConfigs] = React.useState<controllersconfigs[]>(initialData.controllersConfigs);
  const [arifpayEndpoints, setArifpayEndpoints] = React.useState<arifpay_endpoints[]>(initialData.arifpayEndpoints);
  const [promoAdds, setPromoAdds] = React.useState<promo_adds[]>(initialData.promoAdds);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>(initialData.auditLogs);


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
        return allowedCompanies.filter(c => c.ACCOUNTNUMBER === userAccountNumber);
    }
    return allowedCompanies;
  }, [userAccountNumber, allowedCompanies]);

  const filteredMerchants = React.useMemo(() => {
      if (isSystemUser) {
        return merchants;
      }
      if (userAccountNumber) {
          if (isMerchantAdmin) {
              return merchants.filter(m => m.ACCOUNTNUMBER === userAccountNumber);
          }
          if (isMerchantSales) {
              return merchants.filter(m => m.ID === currentUser.userId);
          }
      }
      return [];
  }, [currentUser, isMerchantAdmin, isMerchantSales, userAccountNumber, isSystemUser, merchants]);

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

  const addRole = async (role: Omit<Roles, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'capabilities' | 'permissions' | 'SystemUsers' | 'Merchant_users'> & { pages: string[] }) => {
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
    const { role: updatedRole, auditLog } = await response.json();
    setRoles(prev => prev.map(r => r.ID === updatedRole.ID ? updatedRole : r));
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const deleteRole = async (roleId: string) => {
    const response = await fetch(`/api/roles/${roleId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete role');
    const { auditLog } = await response.json();
    setRoles(prev => prev.filter(r => r.ID !== roleId));
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const addSystemUser = async (user: Omit<SystemUser, 'id' | 'role' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/branch-users', {
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
    const response = await fetch(`/api/branch-users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to update system user');
    const updatedUser = await response.json();
    setSystemUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const updateSystemUserStatus = async (userId: string, status: 'Active' | 'Inactive') => {
    const response = await fetch(`/api/branch-users/${userId}`, {
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

  const addRoleCapability = async (capability: Omit<role_capablities, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSERID' | 'UPDATEUSERID'>) => {
    const response = await fetch('/api/role-capabilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capability),
    });
    if (!response.ok) throw new Error('Failed to create role capability');
    const { capability: newCapability, auditLog } = await response.json();
    setRoleCapabilities(prev => [...prev, newCapability]);
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const deleteRoleCapability = async (id: string) => {
    const response = await fetch(`/api/role-capabilities/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete role capability');
    }
    setRoleCapabilities((prev) => prev.filter((rc) => rc.ID !== id));
  };
  
  const updateRoleCapability = async (capability: role_capablities) => {
    const response = await fetch(`/api/role-capabilities/${capability.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capability),
    });
    if (!response.ok) {
        throw new Error('Failed to update role capability');
    }
    const updatedCapability = await response.json();
    setRoleCapabilities((prev) => prev.map((rc) => (rc.ID === updatedCapability.ID ? updatedCapability : rc)));
  };

  const updateUssdPushSetting = async (setting: ussd_push_settings) => {
    const response = await fetch(`/api/ussd-push-settings/${setting.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
    });
    if (!response.ok) throw new Error('Failed to update USSD Push Setting');
    const { setting: updatedSetting, auditLog } = await response.json();
    setUssdPushSettings((prev) => prev.map((s) => (s.ID === updatedSetting.ID ? updatedSetting : s)));
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const updateStreamPaySetting = async (setting: stream_pay_settings) => {
    const response = await fetch(`/api/stream-pay-settings/${setting.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
    });
    if (!response.ok) throw new Error('Failed to update StreamPay Setting');
    const { setting: updatedSetting, auditLog } = await response.json();
    setStreamPaySettings((prev) => prev.map((s) => (s.ID === updatedSetting.ID ? updatedSetting : s)));
    setAuditLogs(prev => [auditLog, ...prev]);
  };
  
  const updateCoreIntegrationSetting = async (setting: core_integration_settings) => {
    const response = await fetch(`/api/core-integration-settings/${setting.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setting),
    });
    if (!response.ok) throw new Error('Failed to update Core Integration Setting');
    const { setting: updatedSetting, auditLog } = await response.json();
    setCoreIntegrationSettings((prev) => prev.map((s) => (s.ID === updatedSetting.ID ? updatedSetting : s)));
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const updateControllersConfig = async (config: controllersconfigs) => {
    const response = await fetch(`/api/controllers-configs/${config.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
    });
    if (!response.ok) throw new Error('Failed to update controller config');
    const { config: updatedConfig, auditLog } = await response.json();
    setControllersConfigs((prev) => prev.map((c) => (c.ID === updatedConfig.ID ? updatedConfig : c)));
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const addArifpayEndpoint = async (endpoint: Omit<arifpay_endpoints, 'ID' | 'INSERTDATE' | 'UPDATEDATE' | 'INSERTUSER' | 'UPDATEUSER'>) => {
    const response = await fetch(`/api/arifpay-endpoints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint),
    });
    if (!response.ok) throw new Error('Failed to create ArifPay endpoint');
    const { endpoint: newEndpoint, auditLog } = await response.json();
    setArifpayEndpoints((prev) => [...prev, newEndpoint]);
    setAuditLogs(prev => [auditLog, ...prev]);
  };

  const updateArifpayEndpoint = async (endpoint: arifpay_endpoints) => {
    const response = await fetch(`/api/arifpay-endpoints/${endpoint.ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(endpoint),
    });
    if (!response.ok) throw new Error('Failed to update ArifPay endpoint');
    const { endpoint: updatedEndpoint, auditLog } = await response.json();
    setArifpayEndpoints((prev) => prev.map((e) => (e.ID === updatedEndpoint.ID ? updatedEndpoint : e)));
    setAuditLogs(prev => [auditLog, ...prev]);
    };

    const deleteArifpayEndpoint = async (id: string) => {
        const response = await fetch(`/api/arifpay-endpoints/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete ArifPay endpoint');
        const { auditLog } = await response.json();
        setArifpayEndpoints((prev) => prev.filter((e) => e.ID !== id));
        setAuditLogs(prev => [auditLog, ...prev]);
    };

    const addPromoAd = async (ad: Omit<promo_adds, 'ID' | 'INSERTUSERID' | 'UPDATEUSERID' | 'INSERTDATE' | 'UPDATEDATE'>) => {
        const response = await fetch('/api/promo-adds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ad),
        });
        if (!response.ok) throw new Error('Failed to create promo ad');
        const newAd = await response.json();
        setPromoAdds((prev) => [...prev, newAd]);
    };

    const updatePromoAd = async (ad: promo_adds) => {
        const response = await fetch(`/api/promo-adds/${ad.ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ad),
        });
        if (!response.ok) throw new Error('Failed to update promo ad');
        const { ad: updatedAd, auditLog } = await response.json();
        setPromoAdds((prev) => prev.map((a) => (a.ID === updatedAd.ID ? updatedAd : a)));
        setAuditLogs(prev => [auditLog, ...prev]);
    };

    const deletePromoAd = async (id: string) => {
        const response = await fetch(`/api/promo-adds/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete promo ad');
        const { auditLog } = await response.json();
        setPromoAdds((prev) => prev.filter((a) => a.ID !== id));
        setAuditLogs(prev => [auditLog, ...prev]);
    };

  const restoreFromAuditLog = async (auditLogId: string) => {
    const response = await fetch('/api/audit-log/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auditLogId }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to restore record');
    }
    const { restoredRecord, auditLog } = await response.json();
    
    // This is a simplified way to update state. A more robust solution
    // might involve a switch statement on the table name.
    if (auditLog.tableName === 'arifpay_endpoints') {
        setArifpayEndpoints(prev => [...prev, restoredRecord]);
    } else if (auditLog.tableName === 'promo_adds') {
        setPromoAdds(prev => [...prev, restoredRecord]);
    } else if (auditLog.tableName === 'Roles') {
        setRoles(prev => [...prev, restoredRecord]);
    }
    // Add other cases as needed...

    // Add the new 'RESTORE' audit log
    setAuditLogs(prev => [auditLog, ...prev]);
  };


  const value: DataContextType = {
    ...initialData,
    allowedCompanies: filteredAllowedCompanies,
    merchants: filteredMerchants,
    dailyBalances,
    merchantTxns,
    arifRequests,
    paystreamTxns,
    promoAdds,
    accountInfos,
    roles,
    systemUsers,
    roleCapabilities,
    ussdPushSettings,
    streamPaySettings,
    coreIntegrationSettings,
    controllersConfigs,
    arifpayEndpoints,
    auditLogs,
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
    addRoleCapability,
    deleteRoleCapability,
    updateRoleCapability,
    updateUssdPushSetting,
    updateStreamPaySetting,
    updateCoreIntegrationSetting,
    updateControllersConfig,
    addArifpayEndpoint,
    updateArifpayEndpoint,
    deleteArifpayEndpoint,
    addPromoAd,
    updatePromoAd,
    deletePromoAd,
    restoreFromAuditLog,
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
