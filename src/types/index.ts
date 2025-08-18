
import { Prisma } from '@prisma/client';

export type arif_requests = Omit<Prisma.arif_requestsGetPayload<{}>, 'AMOUNT' | 'DATESEND1' | 'DATERECIVED1' | 'DATESEND2' | 'DATERECIVED2' | 'DATESEND3' | 'DATERECIVED3' | 'WEBHOOKRECEIVEDDATE'> & {
  AMOUNT: number;
  DATESEND1: string;
  DATERECIVED1: string;
  DATESEND2: string;
  DATERECIVED2: string;
  DATESEND3: string;
  DATERECIVED3: string;
  WEBHOOKRECEIVEDDATE: string;
};

export type allowed_companies = Omit<Prisma.allowed_companiesGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type Branch = Omit<Prisma.BranchGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type Merchant_users = Omit<Prisma.Merchant_usersGetPayload<{ include: { DashBoardRoles: true, ApplicationRole: true } }>, 'LASTLOGINATTEMPT' | 'UNLOCKEDTIME' | 'INSERTDATE' | 'UPDATEDATE'> & {
  LASTLOGINATTEMPT: string | null;
  UNLOCKEDTIME: string | null;
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type merchants_daily_balances = Omit<Prisma.merchants_daily_balancesGetPayload<{}>, 'DAILYBALANCE' |'BALANCEDATE' | 'INSERTDATE' | 'UPDATEDATE'> & {
  DAILYBALANCE: number;
  BALANCEDATE: string | null;
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type merchant_txns = Omit<Prisma.merchant_txnsGetPayload<{}>, 'AMOUNT' | 'T2TRANSACTIONDATE' | 'INSERTDATE' | 'UPDATEDATE'> & {
    AMOUNT: number;
    T2TRANSACTIONDATE: string | null;
    INSERTDATE: string | null;
    UPDATEDATE: string | null;
};

export type BranchUser = Omit<Prisma.BranchUserGetPayload<{ include: { DashBoardRoles: true } }>, 'password'> & { password?: string };

export type arifpay_endpoints = Omit<Prisma.arifpay_endpointsGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type controllersconfigs = Omit<Prisma.controllersconfigsGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type core_integration_settings = Omit<Prisma.core_integration_settingsGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type paystream_txns = Omit<Prisma.paystream_txnsGetPayload<{}>, 'AMOUNT' | 'INSERTDATE' | 'UPDATEDATE'> & {
    AMOUNT: number;
    INSERTDATE: string | null;
    UPDATEDATE: string | null;
};

export type stream_pay_settings = Omit<Prisma.stream_pay_settingsGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
    INSERTDATE: string | null;
    UPDATEDATE: string | null;
};

export type ussd_push_settings = Omit<Prisma.ussd_push_settingsGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
    INSERTDATE: string | null;
    UPDATEDATE: string | null;
};

export type qr_payments = Omit<Prisma.qr_paymentsGetPayload<{}>, 'AMOUNT' | 'EXPIRETIME' | 'INSERTDATE' | 'UPDATEDATE'> & {
    AMOUNT: number;
    EXPIRETIME: string | null;
    INSERTDATE: string | null;
    UPDATEDATE: string | null;
};

export type account_infos = Omit<Prisma.account_infosGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type promo_adds = Omit<Prisma.promo_addsGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
};

export type role_capablities = Omit<Prisma.role_capablitiesGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE' | 'PARENT' | 'PARENTID'> & {
  INSERTDATE: string | null;
  UPDATEDATE: string | null;
  PARENT: boolean | null;
  PARENTID: string | null;
};

export type DashBoardRoles = Omit<Prisma.DashBoardRolesGetPayload<{}>, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type Roles = Omit<Prisma.RolesGetPayload<{}>, 'INSERTDATE' | 'UPDATEDATE'> & {
    INSERTDATE: string | null;
    UPDATEDATE: string | null;
};

export type EditableItem = allowed_companies | Branch | Merchant_users | BranchUser | controllersconfigs | core_integration_settings | paystream_txns | stream_pay_settings | ussd_push_settings | qr_payments | account_infos | promo_adds | role_capablities | DashBoardRoles | Roles | null;

    