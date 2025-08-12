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
  const merchants = await prisma.merchant_users.findMany();
  const branchUsers = await prisma.branchUser.findMany();
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

  const initialData = {
    branches: branches.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    allowedCompanies: allowedCompanies.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    merchants: merchants.map(item => ({ ...item, LASTLOGINATTEMPT: item.LASTLOGINATTEMPT.toISOString(), UNLOCKEDTIME: item.UNLOCKEDTIME?.toISOString() ?? null, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    branchUsers,
    dailyBalances: dailyBalances.map(item => ({ ...item, BALANCEDATE: item.BALANCEDATE.toISOString(), INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    merchantTxns: merchantTxns.map(item => ({ ...item, T2TRANSACTIONDATE: item.T2TRANSACTIONDATE.toISOString(), INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    arifRequests: arifRequests.map(item => ({...item, DATESEND1: item.DATESEND1?.toISOString() ?? null, DATERECIVED1: item.DATERECIVED1?.toISOString() ?? null, DATESEND2: item.DATESEND2?.toISOString() ?? null, DATERECIVED2: item.DATERECIVED2?.toISOString() ?? null, DATESEND3: item.DATESEND3?.toISOString() ?? null, DATERECIVED3: item.DATERECIVED3?.toISOString() ?? null, WEBHOOKRECEIVEDDATE: item.WEBHOOKRECEIVEDDATE?.toISOString() ?? null })),
    arifpayEndpoints: arifpayEndpoints.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    controllersConfigs: controllersConfigs.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    coreIntegrationSettings: coreIntegrationSettings.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    paystreamTxns: paystreamTxns.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    streamPaySettings: streamPaySettings.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    ussdPushSettings: ussdPushSettings.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    qrPayments: qrPayments.map(item => ({ ...item, EXPIRETIME: item.EXPIRETIME.toISOString(), INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    accountInfos: accountInfos.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    promoAdds: promoAdds.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
    roleCapabilities: roleCapabilities.map(item => ({ ...item, INSERTDATE: item.INSERTDATE.toISOString(), UPDATEDATE: item.UPDATEDATE.toISOString() })),
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
