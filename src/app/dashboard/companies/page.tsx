
import CompanyList from '@/components/company-list';
import type { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  { id: '1', accountNumber: 'ACC001', fieldName: 'Innovate Inc.', branch: 'Downtown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo tech', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '2', accountNumber: 'ACC002', fieldName: 'Apex Solutions', branch: 'Uptown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo business', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '3', accountNumber: 'ACC003', fieldName: 'Quantum Corp', branch: 'Westside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern', approved: false, status: 'Pending' },
  { id: '4', accountNumber: 'ACC004', fieldName: 'Synergy Systems', branch: 'Downtown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo design', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '5', accountNumber: 'ACC005', fieldName: 'Pioneer Ltd.', branch: 'Eastside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo corporate', approved: false, status: 'Inactive' },
  { id: '6', accountNumber: 'ACC006', fieldName: 'Zenith Ventures', branch: 'South Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo abstract', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '7', accountNumber: 'ACC007', fieldName: 'Starlight Co.', branch: 'Uptown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric', approved: false, status: 'Pending' },
  { id: '8', accountNumber: 'ACC008', fieldName: 'Momentum', branch: 'Westside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo minimal', approved: true, status: 'Active', approveUser: 'admin' },
  { id: '9', accountNumber: 'ACC009', fieldName: 'Nexus Group', branch: 'Downtown Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo circle', approved: true, status: 'Inactive', approveUser: 'admin' },
  { id: '10', accountNumber: 'ACC010', fieldName: 'Horizon Dynamics', branch: 'Eastside Branch', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo arrow', approved: true, status: 'Active', approveUser: 'admin' },
];

export default function CompaniesPage() {
  return <CompanyList companies={MOCK_COMPANIES} />;
}
