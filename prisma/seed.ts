
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { prisma } from '../src/lib/prisma';


const MOCK_ALLOWED_COMPANIES = [
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC001', FIELDNAME: 'Innovate Inc.', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Downtown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC002', FIELDNAME: 'Apex Solutions', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-02-20'), UPDATEDATE: new Date('2023-02-20'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Uptown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC003', FIELDNAME: 'Quantum Corp', APPROVEUSER: null, APPROVED: false, STATUS: false, INSERTDATE: new Date('2023-03-10'), UPDATEDATE: new Date('2023-03-10'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Downtown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC004', FIELDNAME: 'Synergy Systems', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-04-05'), UPDATEDATE: new Date('2023-04-05'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Westside Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC005', FIELDNAME: 'Pioneer Ltd.', APPROVEUSER: 'admin', APPROVED: false, STATUS: false, INSERTDATE: new Date('2023-05-12'), UPDATEDATE: new Date('2023-05-12'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'South Branch' },
];

const MOCK_MERCHANT_USERS = [
  { ID: randomUUID(), FULLNAME: 'The Corner Cafe Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '111-222-3333', DEVICENAME: 'Device1', ENCRYPTIONKEY: 'key1', iV: 'iv1', ISLOGGEDIN: true, authenticationkey: 'auth1', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_1', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15') },
  { ID: randomUUID(), FULLNAME: 'QuickMart Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC002', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '222-333-4444', DEVICENAME: 'Device2', ENCRYPTIONKEY: 'key2', iV: 'iv2', ISLOGGEDIN: false, authenticationkey: 'auth2', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_2', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-02-20'), UPDATEDATE: new Date('2023-02-20') },
  { ID: randomUUID(), FULLNAME: 'Gadget Hub Admin', ROLENAME: 'Admin', STATUS: 'Pending', ACCOUNTNUMBER: 'ACC003', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '333-444-5555', DEVICENAME: 'Device3', ENCRYPTIONKEY: 'key3', iV: 'iv3', ISLOGGEDIN: false, authenticationkey: 'auth3', FAILEDATTMEPTS: 2, LASTLOGINATTEMPT: new Date('2023-05-28'), ISLOCKED: true, UNLOCKEDTIME: new Date('2023-06-01T10:00:00Z'), VALUE3: 'v3_3', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-03-10'), UPDATEDATE: new Date('2023-03-10') },
  { ID: randomUUID(), FULLNAME: 'Style Central Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC004', ACCOUNTTYPE: 'TypeC', PHONENUMBER: '444-555-6666', DEVICENAME: 'Device4', ENCRYPTIONKEY: 'key4', iV: 'iv4', ISLOGGEDIN: true, authenticationkey: 'auth4', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_4', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-04-05'), UPDATEDATE: new Date('2023-04-05') },
  { ID: randomUUID(), FULLNAME: 'Bookworm Haven Admin', ROLENAME: 'Admin', STATUS: 'Disabled', ACCOUNTNUMBER: 'ACC005', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '555-666-7777', DEVICENAME: 'Device5', ENCRYPTIONKEY: 'key5', iV: 'iv5', ISLOGGEDIN: false, authenticationkey: 'auth5', FAILEDATTMEPTS: 5, LASTLOGINATTEMPT: new Date('2023-05-20'), ISLOCKED: true, UNLOCKEDTIME: null, VALUE3: 'v3_5', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-05-12'), UPDATEDATE: new Date('2023-05-12') },
  { ID: randomUUID(), FULLNAME: 'Alice Johnson', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '666-777-8888', DEVICENAME: 'Device6', ENCRYPTIONKEY: 'key6', iV: 'iv6', ISLOGGEDIN: false, authenticationkey: 'auth6', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_6', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15') },
  { ID: randomUUID(), FULLNAME: 'Bob Williams', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC002', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '777-888-9999', DEVICENAME: 'Device7', ENCRYPTIONKEY: 'key7', iV: 'iv7', ISLOGGEDIN: true, authenticationkey: 'auth7', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_7', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-02-20'), UPDATEDATE: new Date('2023-02-20') },
  { ID: randomUUID(), FULLNAME: 'Charlie Brown', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '888-777-6666', DEVICENAME: 'Device12', ENCRYPTIONKEY: 'key12', iV: 'iv12', ISLOGGEDIN: true, authenticationkey: 'auth12', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_12', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-01-16'), UPDATEDATE: new Date('2023-01-16') },
];

const MOCK_DAILY_BALANCES = [
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', DAILYBALANCE: 1500.75, DAILYTXNCOUNT: 25, BALANCEDATE: new Date('2023-06-01'), INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', DAILYBALANCE: 1800.50, DAILYTXNCOUNT: 30, BALANCEDATE: new Date('2023-06-02'), INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', DAILYBALANCE: 3200.00, DAILYTXNCOUNT: 50, BALANCEDATE: new Date('2023-06-01'), INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', DAILYBALANCE: 2950.25, DAILYTXNCOUNT: 45, BALANCEDATE: new Date('2023-06-02'), INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC004', MERCHANTPHONE: '444-555-6666', DAILYBALANCE: 500.00, DAILYTXNCOUNT: 10, BALANCEDATE: new Date('2023-06-01'), INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_MERCHANT_TXNS = [
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', AMOUNT: 50.25, TXNID: 'TXN001', CUSTOMERNAME: 'Customer A', CUSTOMERACCOUNT: 'CUST001', T24USER: 't24user1', T2TRANSACTIONDATE: new Date('2023-06-01T10:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '666-777-8888', AMOUNT: 15.00, TXNID: 'TXN002', CUSTOMERNAME: 'Customer B', CUSTOMERACCOUNT: 'CUST002', T24USER: 't24user1', T2TRANSACTIONDATE: new Date('2023-06-01T11:30:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', AMOUNT: 200.00, TXNID: 'TXN003', CUSTOMERNAME: 'Customer C', CUSTOMERACCOUNT: 'CUST003', T24USER: 't24user2', T2TRANSACTIONDATE: new Date('2023-06-01T12:00:00Z'), STATUS: 'Pending', TRANSACTIONCHANNEL: 'Online', TRANSACTIONSERVICE: 'Transfer', VALUE1: 'Note A', VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC004', MERCHANTPHONE: '444-555-6666', AMOUNT: 75.50, TXNID: 'TXN004', CUSTOMERNAME: 'Customer D', CUSTOMERACCOUNT: 'CUST004', T24USER: 't24user3', T2TRANSACTIONDATE: new Date('2023-06-01T14:00:00Z'), STATUS: 'Failed', TRANSACTIONCHANNEL: 'POS', TRANSACTIONSERVICE: 'Purchase', VALUE1: 'Error X', VALUE2: 'Retry 1', VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '777-888-9999', AMOUNT: 500.00, TXNID: 'TXN005', CUSTOMERNAME: 'Customer E', CUSTOMERACCOUNT: 'CUST005', T24USER: 't24user2', T2TRANSACTIONDATE: new Date('2023-06-02T09:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Online', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
]

const MOCK_ARIFPAY_ENDPOINTS = [
    { ID: randomUUID(), BANK: 'Bank of Abyssina', DISPLAYNAME: 'BoA', OTPLENGTH: 6, ORDER: 1, ENDPOINT1: 'https://api.boa.com/v1/pay', ENDPOINT2: 'https://api.boa.com/v1/confirm', ENDPOINT3: '', CANCELURL: 'https://boa.com/cancel', ERRORURL: 'https://boa.com/error', SUCCESSURL: 'https://boa.com/success', NOTIFYURL: 'https://api.myapp.com/notify/boa', ISTWOSTEP: true, ISOTP: true, TRANSACTIONTYPE: 'C2B', BENEFICIARYACCOUNT: '987654321', BENEFICIARYBANK: 'BoA', IMAGEURL: 'https://www.bankofabyssinia.com/wp-content/uploads/2021/08/logo-light.png', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), BANK: 'Awash Bank', DISPLAYNAME: 'Awash', OTPLENGTH: 4, ORDER: 2, ENDPOINT1: 'https://api.awashbank.com/execute', ENDPOINT2: '', ENDPOINT3: '', CANCELURL: 'https://awashbank.com/cancel', ERRORURL: 'https://awashbank.com/error', SUCCESSURL: 'https://awashbank.com/success', NOTIFYURL: 'https://api.myapp.com/notify/awash', ISTWOSTEP: false, ISOTP: false, TRANSACTIONTYPE: 'B2B', BENEFICIARYACCOUNT: '123456789', BENEFICIARYBANK: 'Awash', IMAGEURL: 'https://awashbank.com/wp-content/uploads/2022/10/Awash-Bank-Logo-long.png', INSERTDATE: new Date('2023-01-02'), UPDATEDATE: new Date('2023-01-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), BANK: 'CBE', DISPLAYNAME: 'CBE', OTPLENGTH: 6, ORDER: 3, ENDPOINT1: 'https://api.cbe.com.et/pay', ENDPOINT2: '', ENDPOINT3: '', CANCELURL: 'https://cbe.com.et/cancel', ERRORURL: 'https://cbe.com.et/error', SUCCESSURL: 'https://cbe.com.et/success', NOTIFYURL: 'https://api.myapp.com/notify/cbe', ISTWOSTEP: false, ISOTP: true, TRANSACTIONTYPE: 'C2B', BENEFICIARYACCOUNT: '1000012345678', BENEFICIARYBANK: 'CBE', IMAGEURL: 'https://combanketh.et/cbe-new/wp-content/uploads/2023/07/CBE-Logo-Final.png', INSERTDATE: new Date('2023-01-03'), UPDATEDATE: new Date('2023-01-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), BANK: 'Dashen Bank', DISPLAYNAME: 'Dashen', OTPLENGTH: 5, ORDER: 4, ENDPOINT1: 'https://api.dashenbank.com/v2/payment', ENDPOINT2: 'https://api.dashenbank.com/v2/verify', ENDPOINT3: '', CANCELURL: 'https://dashenbank.com/cancel', ERRORURL: 'https://dashenbank.com/error', SUCCESSURL: 'https://dashenbank.com/success', NOTIFYURL: 'https://api.myapp.com/notify/dashen', ISTWOSTEP: true, ISOTP: true, TRANSACTIONTYPE: 'C2B', BENEFICIARYACCOUNT: '2233445566', BENEFICIARYBANK: 'Dashen', IMAGEURL: 'https://dashenbanksc.com/wp-content/uploads/2023/12/dashen-bank-logo-1.png', INSERTDATE: new Date('2023-01-04'), UPDATEDATE: new Date('2023-01-04'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), BANK: 'Nib Bank', DISPLAYNAME: 'Nib', OTPLENGTH: 6, ORDER: 5, ENDPOINT1: 'https://api.nibbank.com.et/charge', ENDPOINT2: '', ENDPOINT3: '', CANCELURL: 'https://nibbank.com.et/cancel', ERRORURL: 'https://nibbank.com.et/error', SUCCESSURL: 'https://nibbank.com.et/success', NOTIFYURL: 'https://api.myapp.com/notify/nib', ISTWOSTEP: false, ISOTP: false, TRANSACTIONTYPE: 'B2C', BENEFICIARYACCOUNT: '9988776655', BENEFICIARYBANK: 'Nib', IMAGEURL: 'https://www.nibbank.com/wp-content/uploads/2022/08/logo.png', INSERTDATE: new Date('2023-01-05'), UPDATEDATE: new Date('2023-01-05'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_CONTROLLERSCONFIGS = [
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_001', APIKEY: 'API_KEY_001_XYZ', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_002', APIKEY: 'API_KEY_002_ABC', INSERTDATE: new Date('2023-02-15'), UPDATEDATE: new Date('2023-02-15'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_003', APIKEY: 'API_KEY_003_DEF', INSERTDATE: new Date('2023-03-01'), UPDATEDATE: new Date('2023-03-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_004', APIKEY: 'API_KEY_004_GHI', INSERTDATE: new Date('2023-04-10'), UPDATEDATE: new Date('2023-04-10'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_005', APIKEY: 'API_KEY_005_JKL', INSERTDATE: new Date('2023-05-20'), UPDATEDATE: new Date('2023-05-20'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_CORE_INTEGRATION_SETTINGS = [
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_MAIN', ADDRESS: 'https://core.bank.com/api', USERNAME: 'coreapiuser', PASSWORD: 'SuperSecretPassword123', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_BACKUP', ADDRESS: 'https://core-backup.bank.com/api', USERNAME: 'coreapiuser_bk', PASSWORD: 'AnotherSecretPassword456', INSERTDATE: new Date('2023-01-02'), UPDATEDATE: new Date('2023-01-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_QA', ADDRESS: 'https://qa-core.bank.com/api', USERNAME: 'coreapiuser_qa', PASSWORD: 'TestingPassword789', INSERTDATE: new Date('2023-01-03'), UPDATEDATE: new Date('2023-01-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_STAGING', ADDRESS: 'https://staging-core.bank.com/api', USERNAME: 'coreapiuser_stg', PASSWORD: 'StagingPassword101', INSERTDATE: new Date('2023-01-04'), UPDATEDATE: new Date('2023-01-04'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_UAT', ADDRESS: 'https://uat-core.bank.com/api', USERNAME: 'coreapiuser_uat', PASSWORD: 'UatPassword202', INSERTDATE: new Date('2023-01-05'), UPDATEDATE: new Date('2023-01-05'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_PAYSTREAM_TXNS = [
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC001', SALERPHONENUMBER: '666-777-8888', TICKET: 'TKT001', ISCOMPLETED: true, AMOUNT: "125.50", PAYERACCOUNT: 'PAYER001', INSERTDATE: new Date('2023-07-01'), UPDATEDATE: new Date('2023-07-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC002', SALERPHONENUMBER: '777-888-9999', TICKET: 'TKT002', ISCOMPLETED: false, AMOUNT: "300.00", PAYERACCOUNT: 'PAYER002', INSERTDATE: new Date('2023-07-02'), UPDATEDATE: new Date('2023-07-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC001', SALERPHONENUMBER: '666-777-8888', TICKET: 'TKT003', ISCOMPLETED: true, AMOUNT: "75.00", PAYERACCOUNT: 'PAYER003', INSERTDATE: new Date('2023-07-03'), UPDATEDATE: new Date('2023-07-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC004', SALERPHONENUMBER: '888-999-0000', TICKET: 'TKT004', ISCOMPLETED: true, AMOUNT: "50.00", PAYERACCOUNT: 'PAYER004', INSERTDATE: new Date('2023-07-04'), UPDATEDATE: new Date('2023-07-04'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC006', SALERPHONENUMBER: '111-000-1111', TICKET: 'TKT005', ISCOMPLETED: false, AMOUNT: "250.75", PAYERACCOUNT: 'PAYER005', INSERTDATE: new Date('2023-07-05'), UPDATEDATE: new Date('2023-07-05'), INSERTUSER: 'system', UPDATEUSER: 'system' },
]

const MOCK_STREAM_PAY_SETTINGS = [
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v1', IV: 'iv_streampay_123', KEY: 'key_streampay_abc', HV: 'hv_streampay_xyz', USERNAME: 'streamuser', PASSWORD: 'StreamPayPassword1', INSERTDATE: new Date('2023-08-01'), UPDATEDATE: new Date('2023-08-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v2', IV: 'iv_streampay_456', KEY: 'key_streampay_def', HV: 'hv_streampay_uvw', USERNAME: 'streamuser2', PASSWORD: 'StreamPayPassword2', INSERTDATE: new Date('2023-08-02'), UPDATEDATE: new Date('2023-08-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v3', IV: 'iv_streampay_789', KEY: 'key_streampay_ghi', HV: 'hv_streampay_rst', USERNAME: 'streamuser3', PASSWORD: 'StreamPayPassword3', INSERTDATE: new Date('2023-08-03'), UPDATEDATE: new Date('2023-08-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v4', IV: 'iv_streampay_101', KEY: 'key_streampay_jkl', HV: 'hv_streampay_mno', USERNAME: 'streamuser4', PASSWORD: 'StreamPayPassword4', INSERTDATE: new Date('2023-08-04'), UPDATEDATE: new Date('2023-08-04'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v5', IV: 'iv_streampay_112', KEY: 'key_streampay_pqr', HV: 'hv_streampay_stu', USERNAME: 'streamuser5', PASSWORD: 'StreamPayPassword5', INSERTDATE: new Date('2023-08-05'), UPDATEDATE: new Date('2023-08-05'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_USSD_PUSH_SETTINGS = [
    { ID: randomUUID(), ADDRESS: 'https://ussd.gateway.com/push', RESULTURL: 'https://api.myapp.com/ussd/callback', USERNAME: 'ussd_user', PASSWORD: 'UssdPassword123', INSERTDATE: new Date('2023-09-01'), UPDATEDATE: new Date('2023-09-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://another-ussd.gateway.com/push/v2', RESULTURL: 'https://api.myapp.com/ussd/callback2', USERNAME: 'ussd_user2', PASSWORD: 'UssdPassword456', INSERTDATE: new Date('2023-09-02'), UPDATEDATE: new Date('2023-09-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://third-ussd.gateway.com/push/v1', RESULTURL: 'https://api.myapp.com/ussd/callback3', USERNAME: 'ussd_user3', PASSWORD: 'UssdPassword789', INSERTDATE: new Date('2023-09-03'), UPDATEDATE: new Date('2023-09-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://fourth-ussd.gateway.com/submit', RESULTURL: 'https://api.myapp.com/ussd/callback4', USERNAME: 'ussd_user4', PASSWORD: 'UssdPassword101', INSERTDATE: new Date('2023-09-04'), UPDATEDATE: new Date('2023-09-04'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://fifth-ussd.gateway.com/request', RESULTURL: 'https://api.myapp.com/ussd/callback5', USERNAME: 'ussd_user5', PASSWORD: 'UssdPassword202', INSERTDATE: new Date('2023-09-05'), UPDATEDATE: new Date('2023-09-05'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_ACCOUNT_INFOS = [
    { ID: randomUUID(), ACCOUNTNUMBER: 'ACC001', PHONENUMBER: '111-222-3333', FULLNAME: 'The Corner Cafe Admin', GENDER: 'N/A', VALUE1: null, VALUE2: null, INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ACCOUNTNUMBER: 'CUST001', PHONENUMBER: '123-456-7890', FULLNAME: 'Customer A', GENDER: 'Male', VALUE1: 'VIP', VALUE2: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ACCOUNTNUMBER: 'CUST002', PHONENUMBER: '098-765-4321', FULLNAME: 'Customer B', GENDER: 'Female', VALUE1: null, VALUE2: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ACCOUNTNUMBER: 'CUST003', PHONENUMBER: '555-555-5555', FULLNAME: 'Customer C', GENDER: 'Male', VALUE1: null, VALUE2: null, INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ACCOUNTNUMBER: 'CUST004', PHONENUMBER: '555-123-4567', FULLNAME: 'Customer D', GENDER: 'Female', VALUE1: 'New', VALUE2: null, INSERTDATE: new Date('2023-06-03'), UPDATEDATE: new Date('2023-06-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_PROMO_ADDS = [
    { ID: randomUUID(), ADDTITLE: 'Summer Sale!', ADDSUBTITLE: 'Up to 50% off on selected items.', ADDADDRESS: 'https://example.com/summer-sale', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 1, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-01'), UPDATEDATE: new Date('2023-11-01') },
    { ID: randomUUID(), ADDTITLE: 'New Arrivals', ADDSUBTITLE: 'Check out the latest fashion trends.', ADDADDRESS: 'https://example.com/new-arrivals', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 2, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-05'), UPDATEDATE: new Date('2023-11-05') },
    { ID: randomUUID(), ADDTITLE: 'Holiday Special', ADDSUBTITLE: 'Get your gifts now!', ADDADDRESS: 'https://example.com/holiday-special', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 3, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-10'), UPDATEDATE: new Date('2023-11-10') },
    { ID: randomUUID(), ADDTITLE: 'Black Friday Deals', ADDSUBTITLE: 'Doorbuster deals on electronics.', ADDADDRESS: 'https://example.com/black-friday', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 4, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-15'), UPDATEDATE: new Date('2023-11-15') },
    { ID: randomUUID(), ADDTITLE: 'Clearance Event', ADDSUBTITLE: 'Everything must go!', ADDADDRESS: 'https://example.com/clearance', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 5, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-20'), UPDATEDATE: new Date('2023-11-20') },
];

const ALL_PAGES = [
  '/dashboard',
  '/dashboard/allowed_companies',
  '/dashboard/merchant_users',
  '/dashboard/account-infos',
  '/dashboard/promo-adds',
  '/dashboard/daily-balances',
  '/dashboard/merchant-txns',
  '/dashboard/arif-requests',
  '/dashboard/paystream-txns',
  '/dashboard/arifpay-endpoints',
  '/dashboard/controllers-configs',
  '/dashboard/core-integration-settings',
  '/dashboard/stream-pay-settings',
  '/dashboard/ussd-push-settings',
  '/dashboard/role-capabilities',
  '/dashboard/approvals/allowed_companies',
  '/dashboard/role-management',
  '/dashboard/audit-log',
];

const ADMIN_PAGES = [
  '/dashboard',
  '/dashboard/allowed_companies',
  '/dashboard/merchant_users',
  '/dashboard/account-infos',
  '/dashboard/promo-adds',
  '/dashboard/daily-balances',
  '/dashboard/merchant-txns',
  '/dashboard/arif-requests',
  '/dashboard/paystream-txns',
  '/dashboard/approvals/allowed_companies',
];

const SALES_PAGES = [
  '/dashboard',
  '/dashboard/merchant-txns',
  '/dashboard/daily-balances',
];

async function main() {
    console.log(`Start seeding ...`);

    // Deleting data
    await prisma.auditLog.deleteMany({});
    await prisma.dashboard_permissions.deleteMany({});
    await prisma.role_capablities.deleteMany({});
    await prisma.promo_adds.deleteMany({});
    await prisma.account_infos.deleteMany({});
    await prisma.qr_payments.deleteMany({});
    await prisma.ussd_push_settings.deleteMany({});
    await prisma.stream_pay_settings.deleteMany({});
    await prisma.paystream_txns.deleteMany({});
    await prisma.core_integration_settings.deleteMany({});
    await prisma.controllersconfigs.deleteMany({});
    await prisma.arifpay_endpoints.deleteMany({});
    await prisma.arif_requests.deleteMany({});
    await prisma.merchant_txns.deleteMany({});
    await prisma.merchants_daily_balances.deleteMany({});
    await prisma.merchant_users.deleteMany({});
    await prisma.systemUsers.deleteMany({});
    await prisma.allowed_companies.deleteMany({});
    await prisma.roles.deleteMany({});


    // Create default roles
    const systemAdminRole = await prisma.roles.create({ data: { ROLENAME: 'System Admin' }});
    const adminRole = await prisma.roles.create({ data: { ROLENAME: 'Admin' }});
    const salesRole = await prisma.roles.create({ data: { ROLENAME: 'Sales' }});
    
    console.log('Seeded 3 default roles.');

    // Seed permissions for roles
    for (const page of ALL_PAGES) {
      await prisma.dashboard_permissions.create({
        data: { page, roleId: systemAdminRole.ID }
      });
    }
    console.log(`Seeded ${ALL_PAGES.length} permissions for System Admin role.`);

    for (const page of ADMIN_PAGES) {
      await prisma.dashboard_permissions.create({
        data: { page, roleId: adminRole.ID }
      });
    }
    console.log(`Seeded ${ADMIN_PAGES.length} permissions for Admin role.`);

    for (const page of SALES_PAGES) {
      await prisma.dashboard_permissions.create({
        data: { page, roleId: salesRole.ID }
      });
    }
    console.log(`Seeded ${SALES_PAGES.length} permissions for Sales role.`);

    // Seed a default system admin user
    await prisma.systemUsers.create({
      data: {
        name: 'System Admin',
        email: 'admin@system.com',
        password: 'password', // In a real app, HASH THIS!
        status: 'Active',
        roleId: systemAdminRole.ID
      }
    });
    console.log('Seeded 1 default system admin user.');


    for (const c of MOCK_ALLOWED_COMPANIES) {
        await prisma.allowed_companies.create({ data: c });
    }
    console.log(`Seeded ${MOCK_ALLOWED_COMPANIES.length} allowed companies.`);

    for (const m of MOCK_MERCHANT_USERS) {
        const { ROLENAME, ...merchantData } = m;
        let roleId;
        if (ROLENAME === 'Admin') {
            roleId = adminRole.ID;
        } else if (ROLENAME === 'Sales') {
            roleId = salesRole.ID;
        }
        await prisma.merchant_users.create({
            data: {
                ...merchantData,
                ROLE: ROLENAME,
                roleId: roleId,
            }
        });
    }
    console.log(`Seeded ${MOCK_MERCHANT_USERS.length} merchant users.`);

    for (const db of MOCK_DAILY_BALANCES) {
      await prisma.merchants_daily_balances.create({ data: db });
    }
    console.log(`Seeded ${MOCK_DAILY_BALANCES.length} daily balances.`);

    for (const mt of MOCK_MERCHANT_TXNS) {
        await prisma.merchant_txns.create({ data: mt });
    }
    console.log(`Seeded ${MOCK_MERCHANT_TXNS.length} merchant txns.`);

    for (const ae of MOCK_ARIFPAY_ENDPOINTS) {
        await prisma.arifpay_endpoints.create({ data: ae });
    }
    console.log(`Seeded ${MOCK_ARIFPAY_ENDPOINTS.length} arifpay endpoints.`);

    for (const cc of MOCK_CONTROLLERSCONFIGS) {
        await prisma.controllersconfigs.create({ data: cc });
    }
    console.log(`Seeded ${MOCK_CONTROLLERSCONFIGS.length} controllers configs.`);

    for (const cis of MOCK_CORE_INTEGRATION_SETTINGS) {
        await prisma.core_integration_settings.create({ data: cis });
    }
    console.log(`Seeded ${MOCK_CORE_INTEGRATION_SETTINGS.length} core integration settings.`);

    for (const pt of MOCK_PAYSTREAM_TXNS) {
        await prisma.paystream_txns.create({ data: pt });
    }
    console.log(`Seeded ${MOCK_PAYSTREAM_TXNS.length} paystream txns.`);

    for (const sps of MOCK_STREAM_PAY_SETTINGS) {
        await prisma.stream_pay_settings.create({ data: sps });
    }
    console.log(`Seeded ${MOCK_STREAM_PAY_SETTINGS.length} stream pay settings.`);

    for (const ups of MOCK_USSD_PUSH_SETTINGS) {
        await prisma.ussd_push_settings.create({ data: ups });
    }
    console.log(`Seeded ${MOCK_USSD_PUSH_SETTINGS.length} ussd push settings.`);

    for (const ai of MOCK_ACCOUNT_INFOS) {
        await prisma.account_infos.create({ data: ai });
    }
    console.log(`Seeded ${MOCK_ACCOUNT_INFOS.length} account infos.`);

    for (const pa of MOCK_PROMO_ADDS) {
        await prisma.promo_adds.create({ data: pa });
    }
    console.log(`Seeded ${MOCK_PROMO_ADDS.length} promo adds.`);

    console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

    