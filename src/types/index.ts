


export type arif_requests = {
  NONCEID: string;
  SESSIONID: string;
  DEBITACCOUNT: string;
  CREDITACCOUNT: string;
  AMOUNT: number;
  MERCHANTACCOUNT: string;
  SALESPHONE: string;
  REQUEST1: string;
  RESPONSE1: string;
  REQUEST2: string;
  RESPONSE2: string;
  REQUEST3: string;
  RESPONSE3: string;
  WEBHOOKRESPONSE: string;
  ERROR1: string;
  MESSAGE1: string;
  ERROR2: string;
  MESSAGE2: string;
  ERROR3: string;
  MESSAGE3: string;
  DATESEND1: string;
  DATERECIVED1: string;
  DATESEND2: string;
  DATERECIVED2: string;
  DATESEND3: string;
  DATERECIVED3: string;
  WEBHOOKRECEIVEDDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
  ARIFPAYTRANSACTIONID: string;
  ARIFPAYTRANSACTIONSTATUS: string;
  T24TRANSACTIONSTATUS: string;
};

export type allowed_companies = {
  Oid: string;
  ID: string;
  ACCOUNTNUMBER: string;
  FIELDNAME: string;
  APPROVEUSER?: string;
  APPROVED: boolean;
  STATUS: 'Active' | 'Inactive' | 'Pending';
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
  OptimisticLockField: number;
  GCRecord: number;
};

export type Branch = {
  id: string;
  name: string;
  code: string;
  address: string;
  contact: string;
  status: 'Approved' | 'Pending' | 'Rejected';
};

export type Merchant_users = {
  ID: string;
  ACCOUNTNUMBER: string;
  FULLNAME: string;
  ACCOUNTTYPE: string;
  PHONENUMBER: string;
  ROLE: 'Admin' | 'Sales';
  DEVICENAME: string;
  ENCRYPTIONKEY: string;
  iV: string;
  ISLOGGEDIN: boolean;
  authenticationkey: string;
  STATUS: 'Active' | 'Pending' | 'Disabled';
  FAILEDATTMEPTS: number;
  LASTLOGINATTEMPT: string;
  ISLOCKED: boolean;
  UNLOCKEDTIME: string;
  VALUE3: string;
  INSERTUSERID: string;
  UPDATEUSERID: string;
  INSERTDATE: string;
  UPDATEDATE: string;
};

export type merchants_daily_balances = {
  ID: string;
  MERCHANTACCOUNT: string;
  MERCHANTPHONE: string;
  DAILYBALANCE: number;
  DAILYTXNCOUNT: number;
  BALANCEDATE: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
};

export type merchant_txns = {
    ID: string;
    MERCHANTACCOUNT: string;
    MERCHANTPHONE: string;
    AMOUNT: number;
    TXNID: string;
    CUSTOMERNAME: string;
    CUSTOMERACCOUNT: string;
    T24USER: string;
    T2TRANSACTIONDATE: string;
    STATUS: 'Completed' | 'Pending' | 'Failed';
    TRANSACTIONCHANNEL: string;
    TRANSACTIONSERVICE: string;
    VALUE1: string | null;
    VALUE2: string | null;
    VALUE3: string | null;
    INSERTDATE: string;
    UPDATEDATE: string;
    INSERTUSER: string;
    UPDATEUSER: string;
};


export type BranchUser = {
  id: string;
  name: string;
  email: string;
  branch: string;
  status: 'Active' | 'Inactive' | 'Pending';
};

export type arifpay_endpoints = {
  ID: string;
  BANK: string;
  DISPLAYNAME: string;
  OTPLENGTH: number;
  ORDER: number;
  ENDPOINT1: string;
  ENDPOINT2: string;
  ENDPOINT3: string;
  CANCELURL: string;
  ERRORURL: string;
  SUCCESSURL: string;
  NOTIFYURL: string;
  ISTWOSTEP: boolean;
  ISOTP: boolean;
  TRANSACTIONTYPE: string;
  BENEFICIARYACCOUNT: string;
  BENEFICIARYBANK: string;
  IMAGEURL: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
};

export type controllersconfigs = {
  ID: string;
  CONTROLLERKEY: string;
  APIKEY: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
};

export type core_integration_settings = {
  ID: string;
  UNIQUEKEY: string;
  ADDRESS: string;
  USERNAME: string;
  PASSWORD: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
};

export type paystream_txns = {
    ID: string;
    MERCHANTACCOUNTNUMBER: string;
    SALERPHONENUMBER: string;
    TICKET: string;
    ISCOMPLETED: boolean;
    AMOUNT: number;
    PAYERACCOUNT: string;
    INSERTDATE: string;
    UPDATEDATE: string;
    INSERTUSER: string;
    UPDATEUSER: string;
};

export type stream_pay_settings = {
    ID: string;
    ADDRESS: string;
    IV: string;
    KEY: string;
    HV: string;
    USERNAME: string;
    PASSWORD: string;
    INSERTDATE: string;
    UPDATEDATE: string;
    INSERTUSER: string;
    UPDATEUSER: string;
};

export type ussd_push_settings = {
    ID: string;
    ADDRESS: string;
    RESULTURL: string;
    USERNAME: string;
    PASSWORD: string;
    INSERTDATE: string;
    UPDATEDATE: string;
    INSERTUSER: string;
    UPDATEUSER: string;
};

export type qr_payments = {
    ID: string;
    DEBITACCOUNT: string;
    CREDITACCOUNT: string;
    SALERPHONENUMBER: string;
    AMOUNT: number;
    EXPIRETIME: string;
    QRCODE: string;
    ISUSED: boolean;
    INSERTDATE: string;
    UPDATEDATE: string;
    INSERTUSER: string;
    UPDATEUSER: string;
};

export type account_infos = {
  ID: string;
  ACCOUNTNUMBER: string;
  PHONENUMBER: string;
  FULLNAME: string;
  GENDER: string;
  VALUE1: string | null;
  VALUE2: string | null;
  INSERTDATE: string;
  UPDATEDATE: string;
  INSERTUSER: string;
  UPDATEUSER: string;
};

export type promo_adds = {
  ID: string;
  ADDTITLE: string;
  ADDSUBTITLE: string;
  ADDADDRESS: string;
  IMAGEADDRESS: string;
  ORDER: number;
  INSERTUSERID: string;
  UPDATEUSERID: string;
  INSERTDATE: string;
  UPDATEDATE: string;
};

export type EditableItem = allowed_companies | Branch | Merchant_users | BranchUser | controllersconfigs | core_integration_settings | paystream_txns | stream_pay_settings | ussd_push_settings | qr_payments | account_infos | promo_adds | null;
