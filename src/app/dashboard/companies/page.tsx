
import CompanyList from '@/components/company-list';
import type { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Innovate Inc.', accountNumber: 'ACC001', fieldName: 'Innovate Inc.', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo tech', status: 'Approved', approveUser: 'admin' },
  { id: '2', name: 'Apex Solutions', accountNumber: 'ACC002', fieldName: 'Apex Solutions', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo business', status: 'Approved', approveUser: 'admin' },
  { id: '3', name: 'Quantum Corp', accountNumber: 'ACC003', fieldName: 'Quantum Corp', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern', status: 'Pending' },
  { id: '4', name: 'Synergy Systems', accountNumber: 'ACC004', fieldName: 'Synergy Systems', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo design', status: 'Approved', approveUser: 'admin' },
  { id: '5', name: 'Pioneer Ltd.', accountNumber: 'ACC005', fieldName: 'Pioneer Ltd.', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo corporate', status: 'Rejected' },
  { id: '6', name: 'Zenith Ventures', accountNumber: 'ACC006', fieldName: 'Zenith Ventures', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo abstract', status: 'Approved', approveUser: 'admin' },
  { id: '7', name: 'Starlight Co.', accountNumber: 'ACC007', fieldName: 'Starlight Co.', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric', status: 'Pending' },
  { id: '8', name: 'Momentum', accountNumber: 'ACC008', fieldName: 'Momentum', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo minimal', status: 'Approved', approveUser: 'admin' },
  { id: '9', name: 'Nexus Group', accountNumber: 'ACC009', fieldName: 'Nexus Group', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo circle', status: 'Approved', approveUser: 'admin' },
  { id: '10', name: 'Horizon Dynamics', accountNumber: 'ACC010', fieldName: 'Horizon Dynamics', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo arrow', status: 'Approved', approveUser: 'admin' },
];

export default function CompaniesPage() {
  return <CompanyList companies={MOCK_COMPANIES} />;
}
