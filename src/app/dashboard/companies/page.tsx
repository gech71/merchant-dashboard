import CompanyList from '@/components/company-list';
import type { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Innovate Inc.', sales: 150500, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo tech', status: 'Approved' },
  { id: '2', name: 'Apex Solutions', sales: 275000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo business', status: 'Approved' },
  { id: '3', name: 'Quantum Corp', sales: 98000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern', status: 'Pending' },
  { id: '4', name: 'Synergy Systems', sales: 450000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo design', status: 'Approved' },
  { id: '5', name: 'Pioneer Ltd.', sales: 320000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo corporate', status: 'Rejected' },
  { id: '6', name: 'Zenith Ventures', sales: 189000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo abstract', status: 'Approved' },
  { id: '7', name: 'Starlight Co.', sales: 52000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric', status: 'Pending' },
  { id: '8', name: 'Momentum', sales: 680000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo minimal', status: 'Approved' },
  { id: '9', name: 'Nexus Group', sales: 210000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo circle', status: 'Approved' },
  { id: '10', name: 'Horizon Dynamics', sales: 390000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo arrow', status: 'Approved' },
];

export default function CompaniesPage() {
  return <CompanyList companies={MOCK_COMPANIES} />;
}
