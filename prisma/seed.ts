
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';


const MOCK_BRANCHES = [
  { id: randomUUID(), name: 'Downtown Branch', code: 'DT001', address: '123 Main St, Anytown, USA', contact: '555-1234', status: 'Approved' },
  { id: randomUUID(), name: 'Uptown Branch', code: 'UP002', address: '456 Oak Ave, Anytown, USA', contact: '555-5678', status: 'Pending' },
  { id: randomUUID(), name: 'Westside Branch', code: 'WS003', address: '789 Pine Rd, Anytown, USA', contact: '555-9012', status: 'Approved' },
  { id: randomUUID(), name: 'Eastside Branch', code: 'ES004', address: '101 Maple Blvd, Anytown, USA', contact: '555-3456', status: 'Approved' },
  { id: randomUUID(), name: 'South Branch', code: 'SB005', address: '212 Birch Ln, Anytown, USA', contact: '555-7890', status: 'Rejected' },
  { id: randomUUID(), name: 'Northside Branch', code: 'NS006', address: '303 Cedar Dr, Anytown, USA', contact: '555-1122', status: 'Approved' },
  { id: randomUUID(), name: 'Central Hub', code: 'CH007', address: '555 Central Plaza, Anytown, USA', contact: '555-3344', status: 'Approved' },
];

const MOCK_ALLOWED_COMPANIES = [
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC001', FIELDNAME: 'Innovate Inc.', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Downtown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC002', FIELDNAME: 'Apex Solutions', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-02-20'), UPDATEDATE: new Date('2023-02-20'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Uptown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC003', FIELDNAME: 'Quantum Corp', APPROVEUSER: null, APPROVED: false, STATUS: false, INSERTDATE: new Date('2023-03-10'), UPDATEDATE: new Date('2023-03-10'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Downtown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC004', FIELDNAME: 'Synergy Systems', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-04-05'), UPDATEDATE: new Date('2023-04-05'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Westside Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC005', FIELDNAME: 'Pioneer Ltd.', APPROVEUSER: 'admin', APPROVED: false, STATUS: false, INSERTDATE: new Date('2023-05-12'), UPDATEDATE: new Date('2023-05-12'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'South Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC006', FIELDNAME: 'Future Gadgets', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-06-15'), UPDATEDATE: new Date('2023-06-15'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Northside Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC007', FIELDNAME: 'Evergreen Market', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-07-20'), UPDATEDATE: new Date('2023-07-20'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Northside Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC008', FIELDNAME: 'Starlight Books', APPROVEUSER: null, APPROVED: false, STATUS: false, INSERTDATE: new Date('2023-08-10'), UPDATEDATE: new Date('2023-08-10'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Central Hub' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC009', FIELDNAME: 'Velocity Motors', APPROVEUSER: 'admin', APPROVED: true, STATUS: false, INSERTDATE: new Date('2023-09-05'), UPDATEDATE: new Date('2023-09-05'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Uptown Branch' },
  { Oid: randomUUID(), ID: randomUUID(), ACCOUNTNUMBER: 'ACC010', FIELDNAME: 'Zenith Bank', APPROVEUSER: 'admin', APPROVED: true, STATUS: true, INSERTDATE: new Date('2023-10-12'), UPDATEDATE: new Date('2023-10-12'), INSERTUSER: 'system', UPDATEUSER: 'system', OptimisticLockField: 0, GCRecord: 0, branchName: 'Downtown Branch' },
];

const MOCK_MERCHANT_USERS = [
  { ID: randomUUID(), FULLNAME: 'The Corner Cafe Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '111-222-3333', DEVICENAME: 'Device1', ENCRYPTIONKEY: 'key1', iV: 'iv1', ISLOGGEDIN: true, authenticationkey: 'auth1', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_1', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15') },
  { ID: randomUUID(), FULLNAME: 'QuickMart Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC002', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '222-333-4444', DEVICENAME: 'Device2', ENCRYPTIONKEY: 'key2', iV: 'iv2', ISLOGGEDIN: false, authenticationkey: 'auth2', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_2', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-02-20'), UPDATEDATE: new Date('2023-02-20') },
  { ID: randomUUID(), FULLNAME: 'Gadget Hub Admin', ROLENAME: 'Admin', STATUS: 'Pending', ACCOUNTNUMBER: 'ACC003', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '333-444-5555', DEVICENAME: 'Device3', ENCRYPTIONKEY: 'key3', iV: 'iv3', ISLOGGEDIN: false, authenticationkey: 'auth3', FAILEDATTMEPTS: 2, LASTLOGINATTEMPT: new Date('2023-05-28'), ISLOCKED: true, UNLOCKEDTIME: new Date('2023-06-01T10:00:00Z'), VALUE3: 'v3_3', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-03-10'), UPDATEDATE: new Date('2023-03-10') },
  { ID: randomUUID(), FULLNAME: 'Style Central Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC004', ACCOUNTTYPE: 'TypeC', PHONENUMBER: '444-555-6666', DEVICENAME: 'Device4', ENCRYPTIONKEY: 'key4', iV: 'iv4', ISLOGGEDIN: true, authenticationkey: 'auth4', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_4', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-04-05'), UPDATEDATE: new Date('2023-04-05') },
  { ID: randomUUID(), FULLNAME: 'Bookworm Haven Admin', ROLENAME: 'Admin', STATUS: 'Disabled', ACCOUNTNUMBER: 'ACC005', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '555-666-7777', DEVICENAME: 'Device5', ENCRYPTIONKEY: 'key5', iV: 'iv5', ISLOGGEDIN: false, authenticationkey: 'auth5', FAILEDATTMEPTS: 5, LASTLOGINATTEMPT: new Date('2023-05-20'), ISLOCKED: true, UNLOCKEDTIME: null, VALUE3: 'v3_5', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-05-12'), UPDATEDATE: new Date('2023-05-12') },
  { ID: randomUUID(), FULLNAME: 'Future Gadgets Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC006', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '111-000-1111', DEVICENAME: 'Device10', ENCRYPTIONKEY: 'key10', iV: 'iv10', ISLOGGEDIN: true, authenticationkey: 'auth10', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-07-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_10', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-06-15'), UPDATEDATE: new Date('2023-06-15') },
  { ID: randomUUID(), FULLNAME: 'Evergreen Market Admin', ROLENAME: 'Admin', STATUS: 'Active', ACCOUNTNUMBER: 'ACC007', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '222-111-2222', DEVICENAME: 'Device11', ENCRYPTIONKEY: 'key11', iV: 'iv11', ISLOGGEDIN: false, authenticationkey: 'auth11', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-07-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_11', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-07-20'), UPDATEDATE: new Date('2023-07-20') },
  { ID: randomUUID(), FULLNAME: 'Alice Johnson', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '666-777-8888', DEVICENAME: 'Device6', ENCRYPTIONKEY: 'key6', iV: 'iv6', ISLOGGEDIN: false, authenticationkey: 'auth6', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_6', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15') },
  { ID: randomUUID(), FULLNAME: 'Bob Williams', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC002', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '777-888-9999', DEVICENAME: 'Device7', ENCRYPTIONKEY: 'key7', iV: 'iv7', ISLOGGEDIN: true, authenticationkey: 'auth7', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_7', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-02-20'), UPDATEDATE: new Date('2023-02-20') },
  { ID: randomUUID(), FULLNAME: 'Charlie Brown', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC001', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '888-777-6666', DEVICENAME: 'Device12', ENCRYPTIONKEY: 'key12', iV: 'iv12', ISLOGGEDIN: true, authenticationkey: 'auth12', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_12', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-01-16'), UPDATEDATE: new Date('2023-01-16') },
  { ID: randomUUID(), FULLNAME: 'Diana Prince', ROLENAME: 'Sales', STATUS: 'Pending', ACCOUNTNUMBER: 'ACC004', ACCOUNTTYPE: 'TypeC', PHONENUMBER: '888-999-0000', DEVICENAME: 'Device8', ENCRYPTIONKEY: 'key8', iV: 'iv8', ISLOGGEDIN: false, authenticationkey: 'auth8', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-06-01'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_8', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-04-05'), UPDATEDATE: new Date('2023-04-05') },
  { ID: randomUUID(), FULLNAME: 'Ethan Hunt', ROLENAME: 'Sales', STATUS: 'Active', ACCOUNTNUMBER: 'ACC006', ACCOUNTTYPE: 'TypeA', PHONENUMBER: '333-222-1111', DEVICENAME: 'Device13', ENCRYPTIONKEY: 'key13', iV: 'iv13', ISLOGGEDIN: false, authenticationkey: 'auth13', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-07-02'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_13', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-06-16'), UPDATEDATE: new Date('2023-06-16') },
  { ID: randomUUID(), FULLNAME: 'Fiona Glenanne', ROLENAME: 'Sales', STATUS: 'Disabled', ACCOUNTNUMBER: 'ACC007', ACCOUNTTYPE: 'TypeB', PHONENUMBER: '444-333-2222', DEVICENAME: 'Device14', ENCRYPTIONKEY: 'key14', iV: 'iv14', ISLOGGEDIN: false, authenticationkey: 'auth14', FAILEDATTMEPTS: 0, LASTLOGINATTEMPT: new Date('2023-07-21'), ISLOCKED: false, UNLOCKEDTIME: null, VALUE3: 'v3_14', INSERTUSERID: 'sys', UPDATEUSERID: 'sys', INSERTDATE: new Date('2023-07-21'), UPDATEDATE: new Date('2023-07-21') },
];

const MOCK_BRANCH_USERS = [
  { id: randomUUID(), name: 'John Doe', email: 'john.d@branch.com', branch: 'Downtown Branch', status: 'Active' },
  { id: randomUUID(), name: 'Jane Smith', email: 'jane.s@branch.com', branch: 'Uptown Branch', status: 'Active' },
  { id: randomUUID(), name: 'Peter Jones', email: 'peter.j@branch.com', branch: 'Downtown Branch', status: 'Inactive' },
  { id: randomUUID(), name: 'Mary Johnson', email: 'mary.j@branch.com', branch: 'Westside Branch', status: 'Pending' },
  { id: randomUUID(), name: 'David Williams', email: 'david.w@branch.com', branch: 'Uptown Branch', status: 'Active' },
  { id: randomUUID(), name: 'Susan Clark', email: 'susan.c@branch.com', branch: 'Northside Branch', status: 'Active' },
  { id: randomUUID(), name: 'Tom Brown', email: 'tom.b@branch.com', branch: 'Central Hub', status: 'Active' },
];

const MOCK_DAILY_BALANCES = [
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', DAILYBALANCE: 1500.75, DAILYTXNCOUNT: 25, BALANCEDATE: new Date('2023-06-01'), INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', DAILYBALANCE: 1800.50, DAILYTXNCOUNT: 30, BALANCEDATE: new Date('2023-06-02'), INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', DAILYBALANCE: 3200.00, DAILYTXNCOUNT: 50, BALANCEDATE: new Date('2023-06-01'), INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', DAILYBALANCE: 2950.25, DAILYTXNCOUNT: 45, BALANCEDATE: new Date('2023-06-02'), INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC004', MERCHANTPHONE: '444-555-6666', DAILYBALANCE: 500.00, DAILYTXNCOUNT: 10, BALANCEDATE: new Date('2023-06-01'), INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC006', MERCHANTPHONE: '111-000-1111', DAILYBALANCE: 7500.00, DAILYTXNCOUNT: 80, BALANCEDATE: new Date('2023-07-01'), INSERTDATE: new Date('2023-07-01'), UPDATEDATE: new Date('2023-07-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC007', MERCHANTPHONE: '222-111-2222', DAILYBALANCE: 1200.00, DAILYTXNCOUNT: 15, BALANCEDATE: new Date('2023-07-21'), INSERTDATE: new Date('2023-07-21'), UPDATEDATE: new Date('2023-07-21'), INSERTUSER: 'system', UPDATEUSER: 'system' },
  { ID: randomUUID(), MERCHANTACCOUNT: 'ACC010', MERCHANTPHONE: '999-888-7777', DAILYBALANCE: 9800.50, DAILYTXNCOUNT: 120, BALANCEDATE: new Date('2023-10-13'), INSERTDATE: new Date('2023-10-13'), UPDATEDATE: new Date('2023-10-13'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_MERCHANT_TXNS = [
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '111-222-3333', AMOUNT: 50.25, TXNID: 'TXN001', CUSTOMERNAME: 'Customer A', CUSTOMERACCOUNT: 'CUST001', T24USER: 't24user1', T2TRANSACTIONDATE: new Date('2023-06-01T10:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '666-777-8888', AMOUNT: 15.00, TXNID: 'TXN002', CUSTOMERNAME: 'Customer B', CUSTOMERACCOUNT: 'CUST002', T24USER: 't24user1', T2TRANSACTIONDATE: new Date('2023-06-01T11:30:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '222-333-4444', AMOUNT: 200.00, TXNID: 'TXN003', CUSTOMERNAME: 'Customer C', CUSTOMERACCOUNT: 'CUST003', T24USER: 't24user2', T2TRANSACTIONDATE: new Date('2023-06-01T12:00:00Z'), STATUS: 'Pending', TRANSACTIONCHANNEL: 'Online', TRANSACTIONSERVICE: 'Transfer', VALUE1: 'Note A', VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC004', MERCHANTPHONE: '444-555-6666', AMOUNT: 75.50, TXNID: 'TXN004', CUSTOMERNAME: 'Customer D', CUSTOMERACCOUNT: 'CUST004', T24USER: 't24user3', T2TRANSACTIONDATE: new Date('2023-06-01T14:00:00Z'), STATUS: 'Failed', TRANSACTIONCHANNEL: 'POS', TRANSACTIONSERVICE: 'Purchase', VALUE1: 'Error X', VALUE2: 'Retry 1', VALUE3: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC002', MERCHANTPHONE: '777-888-9999', AMOUNT: 500.00, TXNID: 'TXN005', CUSTOMERNAME: 'Customer E', CUSTOMERACCOUNT: 'CUST005', T24USER: 't24user2', T2TRANSACTIONDATE: new Date('2023-06-02T09:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Online', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-02'), UPDATEDATE: new Date('2023-06-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC006', MERCHANTPHONE: '111-000-1111', AMOUNT: 120.00, TXNID: 'TXN006', CUSTOMERNAME: 'Customer F', CUSTOMERACCOUNT: 'CUST006', T24USER: 't24user4', T2TRANSACTIONDATE: new Date('2023-07-01T10:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-07-01'), UPDATEDATE: new Date('2023-07-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC006', MERCHANTPHONE: '333-222-1111', AMOUNT: 85.50, TXNID: 'TXN007', CUSTOMERNAME: 'Customer G', CUSTOMERACCOUNT: 'CUST007', T24USER: 't24user4', T2TRANSACTIONDATE: new Date('2023-07-02T11:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'POS', TRANSACTIONSERVICE: 'Purchase', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-07-02'), UPDATEDATE: new Date('2023-07-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNT: 'ACC001', MERCHANTPHONE: '888-777-6666', AMOUNT: 25.00, TXNID: 'TXN008', CUSTOMERNAME: 'Customer H', CUSTOMERACCOUNT: 'CUST008', T24USER: 't24user1', T2TRANSACTIONDATE: new Date('2023-06-03T15:00:00Z'), STATUS: 'Completed', TRANSACTIONCHANNEL: 'Mobile', TRANSACTIONSERVICE: 'Payment', VALUE1: null, VALUE2: null, VALUE3: null, INSERTDATE: new Date('2023-06-03'), UPDATEDATE: new Date('2023-06-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
]

const MOCK_ARIFPAY_ENDPOINTS = [
    { ID: randomUUID(), BANK: 'Bank of Abyssina', DISPLAYNAME: 'BoA', OTPLENGTH: 6, ORDER: 1, ENDPOINT1: 'https://api.boa.com/v1/pay', ENDPOINT2: 'https://api.boa.com/v1/confirm', ENDPOINT3: '', CANCELURL: 'https://boa.com/cancel', ERRORURL: 'https://boa.com/error', SUCCESSURL: 'https://boa.com/success', NOTIFYURL: 'https://api.myapp.com/notify/boa', ISTWOSTEP: true, ISOTP: true, TRANSACTIONTYPE: 'C2B', BENEFICIARYACCOUNT: '987654321', BENEFICIARYBANK: 'BoA', IMAGEURL: 'https://placehold.co/100x40.png', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), BANK: 'Awash Bank', DISPLAYNAME: 'Awash', OTPLENGTH: 4, ORDER: 2, ENDPOINT1: 'https://api.awashbank.com/execute', ENDPOINT2: '', ENDPOINT3: '', CANCELURL: 'https://awashbank.com/cancel', ERRORURL: 'https://awashbank.com/error', SUCCESSURL: 'https://awashbank.com/success', NOTIFYURL: 'https://api.myapp.com/notify/awash', ISTWOSTEP: false, ISOTP: false, TRANSACTIONTYPE: 'B2B', BENEFICIARYACCOUNT: '123456789', BENEFICIARYBANK: 'Awash', IMAGEURL: 'https://placehold.co/100x40.png', INSERTDATE: new Date('2023-01-02'), UPDATEDATE: new Date('2023-01-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_CONTROLLERSCONFIGS = [
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_001', APIKEY: 'API_KEY_001_XYZ', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), CONTROLLERKEY: 'CTRL_KEY_002', APIKEY: 'API_KEY_002_ABC', INSERTDATE: new Date('2023-02-15'), UPDATEDATE: new Date('2023-02-15'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_CORE_INTEGRATION_SETTINGS = [
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_MAIN', ADDRESS: 'https://core.bank.com/api', USERNAME: 'coreapiuser', PASSWORD: 'SuperSecretPassword123', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), UNIQUEKEY: 'INTEGRATION_BACKUP', ADDRESS: 'https://core-backup.bank.com/api', USERNAME: 'coreapiuser_bk', PASSWORD: 'AnotherSecretPassword456', INSERTDATE: new Date('2023-01-02'), UPDATEDATE: new Date('2023-01-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_PAYSTREAM_TXNS = [
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC001', SALERPHONENUMBER: '666-777-8888', TICKET: 'TKT001', ISCOMPLETED: true, AMOUNT: "125.50", PAYERACCOUNT: 'PAYER001', INSERTDATE: new Date('2023-07-01'), UPDATEDATE: new Date('2023-07-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC002', SALERPHONENUMBER: '777-888-9999', TICKET: 'TKT002', ISCOMPLETED: false, AMOUNT: "300.00", PAYERACCOUNT: 'PAYER002', INSERTDATE: new Date('2023-07-02'), UPDATEDATE: new Date('2023-07-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), MERCHANTACCOUNTNUMBER: 'ACC001', SALERPHONENUMBER: '666-777-8888', TICKET: 'TKT003', ISCOMPLETED: true, AMOUNT: "75.00", PAYERACCOUNT: 'PAYER003', INSERTDATE: new Date('2023-07-03'), UPDATEDATE: new Date('2023-07-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
]

const MOCK_STREAM_PAY_SETTINGS = [
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v1', IV: 'iv_streampay_123', KEY: 'key_streampay_abc', HV: 'hv_streampay_xyz', USERNAME: 'streamuser', PASSWORD: 'StreamPayPassword1', INSERTDATE: new Date('2023-08-01'), UPDATEDATE: new Date('2023-08-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://streampay.api/v2', IV: 'iv_streampay_456', KEY: 'key_streampay_def', HV: 'hv_streampay_uvw', USERNAME: 'streamuser2', PASSWORD: 'StreamPayPassword2', INSERTDATE: new Date('2023-08-02'), UPDATEDATE: new Date('2023-08-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_USSD_PUSH_SETTINGS = [
    { ID: randomUUID(), ADDRESS: 'https://ussd.gateway.com/push', RESULTURL: 'https://api.myapp.com/ussd/callback', USERNAME: 'ussd_user', PASSWORD: 'UssdPassword123', INSERTDATE: new Date('2023-09-01'), UPDATEDATE: new Date('2023-09-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ADDRESS: 'https://another-ussd.gateway.com/push/v2', RESULTURL: 'https://api.myapp.com/ussd/callback2', USERNAME: 'ussd_user2', PASSWORD: 'UssdPassword456', INSERTDATE: new Date('2023-09-02'), UPDATEDATE: new Date('2023-09-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_QR_PAYMENTS = [
    { ID: randomUUID(), DEBITACCOUNT: 'D001', CREDITACCOUNT: 'C001', SALERPHONENUMBER: '666-777-8888', AMOUNT: 50.00, EXPIRETIME: new Date('2023-10-31T23:59:59Z'), QRCODE: 'dummy-qr-code-1', ISUSED: false, INSERTDATE: new Date('2023-10-01'), UPDATEDATE: new Date('2023-10-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), DEBITACCOUNT: 'D002', CREDITACCOUNT: 'C002', SALERPHONENUMBER: '777-888-9999', AMOUNT: 150.75, EXPIRETIME: new Date('2023-11-15T12:00:00Z'), QRCODE: 'dummy-qr-code-2', ISUSED: true, INSERTDATE: new Date('2023-10-02'), UPDATEDATE: new Date('2023-10-02'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), DEBITACCOUNT: 'D003', CREDITACCOUNT: 'C001', SALERPHONENUMBER: '888-999-0000', AMOUNT: 25.00, EXPIRETIME: new Date('2023-11-01T08:30:00Z'), QRCODE: 'dummy-qr-code-3', ISUSED: false, INSERTDATE: new Date('2023-10-03'), UPDATEDATE: new Date('2023-10-03'), INSERTUSER: 'system', UPDATEUSER: 'system' },
]

const MOCK_ACCOUNT_INFOS = [
    { ID: randomUUID(), ACCOUNTNUMBER: 'ACC001', PHONENUMBER: '111-222-3333', FULLNAME: 'The Corner Cafe Admin', GENDER: 'N/A', VALUE1: null, VALUE2: null, INSERTDATE: new Date('2023-01-15'), UPDATEDATE: new Date('2023-01-15'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ACCOUNTNUMBER: 'CUST001', PHONENUMBER: '123-456-7890', FULLNAME: 'Customer A', GENDER: 'Male', VALUE1: 'VIP', VALUE2: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
    { ID: randomUUID(), ACCOUNTNUMBER: 'CUST002', PHONENUMBER: '098-765-4321', FULLNAME: 'Customer B', GENDER: 'Female', VALUE1: null, VALUE2: null, INSERTDATE: new Date('2023-06-01'), UPDATEDATE: new Date('2023-06-01'), INSERTUSER: 'system', UPDATEUSER: 'system' },
];

const MOCK_PROMO_ADDS = [
    { ID: randomUUID(), ADDTITLE: 'Summer Sale!', ADDSUBTITLE: 'Up to 50% off on selected items.', ADDADDRESS: 'https://example.com/summer-sale', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 1, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-01'), UPDATEDATE: new Date('2023-11-01') },
    { ID: randomUUID(), ADDTITLE: 'New Arrivals', ADDSUBTITLE: 'Check out the latest fashion trends.', ADDADDRESS: 'https://example.com/new-arrivals', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 2, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-05'), UPDATEDATE: new Date('2023-11-05') },
    { ID: randomUUID(), ADDTITLE: 'Holiday Special', ADDSUBTITLE: 'Get your gifts now!', ADDADDRESS: 'https://example.com/holiday-special', IMAGEADDRESS: 'https://placehold.co/600x400.png', ORDER: 3, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-11-10'), UPDATEDATE: new Date('2023-11-10') },
];

const MOCK_ROLE_CAPABILITIES = [
    { ID: randomUUID(), ROLEID: 'Admin', MENUORDER: 1, SUBMENUORDER: 0, MENUNAME: 'Dashboard', MENUNAME_am: 'ዳሽቦርድ', ADDRESS: '/dashboard', PARENT: true, PARENTID: '0', VALUE3: null, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01') },
    { ID: randomUUID(), ROLEID: 'Admin', MENUORDER: 2, SUBMENUORDER: 1, MENUNAME: 'Allowed Companies', MENUNAME_am: 'የተፈቀዱ ኩባንያዎች', ADDRESS: '/dashboard/allowed_companies', PARENT: false, PARENTID: 'mg_1', VALUE3: null, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01') },
    { ID: randomUUID(), ROLEID: 'Sales', MENUORDER: 1, SUBMENUORDER: 0, MENUNAME: 'My Transactions', MENUNAME_am: 'የእኔ ግብይቶች', ADDRESS: '/dashboard/merchant-txns', PARENT: true, PARENTID: '0', VALUE3: null, INSERTUSERID: 'system', UPDATEUSERID: 'system', INSERTDATE: new Date('2023-01-01'), UPDATEDATE: new Date('2023-01-01') },
];

async function main() {
    console.log(`Start seeding ...`);

    // Deleting data
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
    await prisma.branchUser.deleteMany({});
    await prisma.merchant_users.deleteMany({});
    await prisma.allowed_companies.deleteMany({});
    await prisma.branch.deleteMany({});
    await prisma.dashBoardRoles.deleteMany({});
    await prisma.roles.deleteMany({});


    // Create default roles
    const ALL_PAGES = [
        "/dashboard", "/dashboard/allowed_companies", "/dashboard/branches",
        "/dashboard/branch-users", "/dashboard/merchant_users", "/dashboard/account-infos",
        "/dashboard/promo-adds", "/dashboard/daily-balances", "/dashboard/merchant-txns",
        "/dashboard/arif-requests", "/dashboard/paystream-txns", "/dashboard/qr-payments",
        "/dashboard/arifpay-endpoints", "/dashboard/controllers-configs",
        "/dashboard/core-integration-settings", "/dashboard/stream-pay-settings",
        "/dashboard/ussd-push-settings", "/dashboard/role-capabilities",
        "/dashboard/approvals/allowed_companies", "/dashboard/approvals/branch_users",
        "/dashboard/role-management", "/dashboard/user-role-assignment"
    ];

    const systemAdminRole = await prisma.dashBoardRoles.create({
        data: {
            id: randomUUID(),
            name: 'System Admin',
            description: 'Has full access to all system features and data across all companies.',
            permissions: { "pages": ALL_PAGES }
        }
    });

    const branchAdminRole = await prisma.dashBoardRoles.create({
        data: {
            id: randomUUID(),
            name: 'Branch Admin',
            description: 'Can manage companies and users within their own branch, including approvals.',
            permissions: {
                "pages": [
                    "/dashboard",
                    "/dashboard/allowed_companies",
                    "/dashboard/approvals/allowed_companies"
                ]
            }
        }
    });

    const branchUserRole = await prisma.dashBoardRoles.create({
        data: {
            id: randomUUID(),
            name: 'Branch User',
            description: 'Can create and update companies within their branch, but cannot approve them.',
            permissions: {
                 "pages": [
                    "/dashboard",
                    "/dashboard/allowed_companies",
                ]
            }
        }
    });

    const merchantAdminRole = await prisma.dashBoardRoles.create({
        data: {
            id: randomUUID(),
            name: 'Merchant Admin',
            description: 'Full dashboard access, restricted to their own company.',
            permissions: {
                "pages": [
                    "/dashboard/merchant_users",
                    "/dashboard/daily-balances",
                    "/dashboard/merchant-txns",
                ]
            }
        }
    });

    const merchantSalesRole = await prisma.dashBoardRoles.create({
        data: {
            id: randomUUID(),
            name: 'Merchant Sales',
            description: 'Can only view their own transactions and basic company info.',
            permissions: {
                "pages": [
                    "/dashboard/merchant-txns"
                ]
            }
        }
    });
    console.log('Seeded 5 default dashboard roles.');

    // Seed Application Roles
    const adminRole = await prisma.roles.create({ data: { ID: randomUUID(), ROLENAME: 'Admin' }});
    const salesRole = await prisma.roles.create({ data: { ID: randomUUID(), ROLENAME: 'Sales' }});
    console.log('Seeded 2 application roles (Admin, Sales).');


    // Seed "All Branches" first
    await prisma.branch.create({
        data: {
            id: randomUUID(),
            name: 'All Branches',
            code: 'GLOBAL',
            address: 'System-wide',
            contact: 'N/A',
            status: 'Approved'
        }
    });
    console.log('Seeded "All Branches" for system users.');

    await prisma.branchUser.create({
        data: {
            id: randomUUID(),
            name: 'System Admin',
            email: 'systemadmin@gmail.com',
            branch: 'All Branches', // System admin is not tied to a specific branch
            status: 'Active',
            password: 'password@1232', // This will be hashed in a real app
            roleId: systemAdminRole.id
        }
    });
    console.log('Seeded System Admin user.');


    for (const b of MOCK_BRANCHES) {
        await prisma.branch.create({ data: b });
    }
    console.log(`Seeded ${MOCK_BRANCHES.length} branches.`);

    for (const c of MOCK_ALLOWED_COMPANIES) {
        await prisma.allowed_companies.create({ data: c });
    }
    console.log(`Seeded ${MOCK_ALLOWED_COMPANIES.length} allowed companies.`);

    for (const m of MOCK_MERCHANT_USERS) {
        let roleId;
        let dashboardRoleId;
        if (m.ROLENAME === 'Admin') {
            roleId = adminRole.ID;
            dashboardRoleId = merchantAdminRole.id;
        } else {
            roleId = salesRole.ID;
            dashboardRoleId = merchantSalesRole.id;
        }
       
        await prisma.merchant_users.create({
            data: {
                ...m,
                ROLE: m.ROLENAME,
                roleId: roleId,
                dashboardRoleId: dashboardRoleId
            }
        });
    }
    console.log(`Seeded ${MOCK_MERCHANT_USERS.length} merchant users.`);

    for (const bu of MOCK_BRANCH_USERS) {
        await prisma.branchUser.create({ data: {
            ...bu,
            password: 'password123', // This will be hashed in a real app
            // Assign roles based on name for mock purposes
            roleId: bu.name.includes('Jane') ? branchAdminRole.id : branchUserRole.id
        } });
    }
    console.log(`Seeded ${MOCK_BRANCH_USERS.length} branch users.`);

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

    for (const qp of MOCK_QR_PAYMENTS) {
        await prisma.qr_payments.create({ data: qp });
    }
    console.log(`Seeded ${MOCK_QR_PAYMENTS.length} qr payments.`);

    for (const ai of MOCK_ACCOUNT_INFOS) {
        await prisma.account_infos.create({ data: ai });
    }
    console.log(`Seeded ${MOCK_ACCOUNT_INFOS.length} account infos.`);

    for (const pa of MOCK_PROMO_ADDS) {
        await prisma.promo_adds.create({ data: pa });
    }
    console.log(`Seeded ${MOCK_PROMO_ADDS.length} promo adds.`);

    for (const rc of MOCK_ROLE_CAPABILITIES) {
        const { ROLENAME: ROLEID, ...rest } = rc;
        const role = await prisma.roles.findFirst({ where: { ROLENAME: ROLEID } });
        if(role){
            await prisma.role_capablities.create({ data: {
                ...rest,
                ROLEID: role.ID,
                PARENT: rc.PARENT === true,
                PARENTID: rc.PARENTID === '0' ? null : rc.PARENTID
            } });
        }
    }
    console.log(`Seeded ${MOCK_ROLE_CAPABILITIES.length} role capabilities.`);

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

    