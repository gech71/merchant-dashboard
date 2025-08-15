
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ClientSidebarProvider } from '@/components/client-sidebar-provider';
import { DataProvider } from '@/context/data-context';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'MerchantView',
  description: 'Admin Dashboard for Merchant Management',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const branches = await prisma.branch.findMany();
  const allowedCompanies = await prisma.allowed_companies.findMany();
  const merchants = await prisma.Merchant_users.findMany({ include: { DashBoardRoles: true }});
  const branchUsers = await prisma.branchUser.findMany({ include: { DashBoardRoles: true }});
  const dailyBalances = await prisma.merchants_daily_balances.findMany();
  const merchantTxns = await prisma.merchant_txns.findMany();
  const arifRequests = await prisma.arif_requests.findMany();
  const arifpayEndpoints = await prisma.arifpay_endpoints.findMany();
  const controllersConfigs = await prisma.controllersconfigs.findMany();
  const coreIntegrationSettings = await prisma.core_integration_settings.findMany();
  const paystreamTxns = await prisma.paystream_txns.findMany();
  const streamPaySettings = await prisma.stream_pay_settings.findMany();
  const ussdPushSettings = await prisma.ussd_push_settings.findMany();
  const qrPayments = await prisma.qr_payments.findMany();
  const accountInfos = await prisma.account_infos.findMany();
  const promoAdds = await prisma.promo_adds.findMany();
  const roleCapabilities = await prisma.role_capablities.findMany();
  const roles = await prisma.dashBoardRoles.findMany();

  const initialData = {
    branches: branches.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    allowedCompanies: allowedCompanies.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    merchants: merchants.map(item => ({ ...item, DashBoardRoles: item.DashBoardRoles ? { ...item.DashBoardRoles, createdAt: item.DashBoardRoles.createdAt.toISOString(), updatedAt: item.DashBoardRoles.updatedAt.toISOString() } : null, LASTLOGINATTEMPT: item.LASTLOGINATTEMPT?.toISOString() ?? null, UNLOCKEDTIME: item.UNLOCKEDTIME?.toISOString() ?? null, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    branchUsers: branchUsers.map(user => ({...user, password: '', DashBoardRoles: user.DashBoardRoles ? { ...user.DashBoardRoles, createdAt: user.DashBoardRoles.createdAt.toISOString(), updatedAt: user.DashBoardRoles.updatedAt.toISOString() } : null })),
    dailyBalances: dailyBalances.map(item => ({ ...item, DAILYBALANCE: item.DAILYBALANCE, BALANCEDATE: item.BALANCEDATE?.toISOString() ?? null, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    merchantTxns: merchantTxns.map(item => ({ ...item, AMOUNT: item.AMOUNT, T2TRANSACTIONDATE: item.T2TRANSACTIONDATE?.toISOString() ?? null, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    arifRequests: arifRequests.map(item => ({...item, AMOUNT: item.AMOUNT.toNumber(), DATESEND1: item.DATESEND1?.toISOString() ?? null, DATERECIVED1: item.DATERECIVED1?.toISOString() ?? null, DATESEND2: item.DATESEND2?.toISOString() ?? null, DATERECIVED2: item.DATERECIVED2?.toISOString() ?? null, DATESEND3: item.DATESEND3?.toISOString() ?? null, DATERECIVED3: item.DATERECIVED3?.toISOString() ?? null, WEBHOOKRECEIVEDDATE: item.WEBHOOKRECEIVEDDATE?.toISOString() ?? null })),
    arifpayEndpoints: arifpayEndpoints.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    controllersConfigs: controllersConfigs.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    coreIntegrationSettings: coreIntegrationSettings.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    paystreamTxns: paystreamTxns.map(item => ({ ...item, AMOUNT: parseFloat(item.AMOUNT), INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    streamPaySettings: streamPaySettings.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    ussdPushSettings: ussdPushSettings.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    qrPayments: qrPayments.map(item => ({ ...item, AMOUNT: item.AMOUNT.toNumber(), EXPIRETIME: item.EXPIRETIME?.toISOString() ?? null, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    accountInfos: accountInfos.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    promoAdds: promoAdds.map(item => ({ ...item, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    roleCapabilities: roleCapabilities.map(item => ({ ...item, PARENT: item.PARENT ?? false, PARENTID: item.PARENTID ?? null, INSERTDATE: item.INSERTDATE?.toISOString() ?? null, UPDATEDATE: item.UPDATEDATE?.toISOString() ?? null })),
    roles: roles.map(role => ({ ...role, createdAt: role.createdAt.toISOString(), updatedAt: role.updatedAt.toISOString() })),
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <DataProvider initialData={initialData}>
          <ClientSidebarProvider>
            {children}
          </ClientSidebarProvider>
        </DataProvider>
        <Toaster />
      </body>
    </html>
  );
}
