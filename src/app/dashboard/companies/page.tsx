import CompanyList from '@/components/company-list';
import type { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  { id: '1', name: 'Innovate Inc.', sales: 150500, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo tech' },
  { id: '2', name: 'Apex Solutions', sales: 275000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo business' },
  { id: '3', name: 'Quantum Corp', sales: 98000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern' },
  { id: '4', name: 'Synergy Systems', sales: 450000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo design' },
  { id: '5', name: 'Pioneer Ltd.', sales: 320000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo corporate' },
  { id: '6', name: 'Zenith Ventures', sales: 189000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo abstract' },
  { id: '7', name: 'Starlight Co.', sales: 52000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric' },
  { id: '8', name: 'Momentum', sales: 680000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo minimal' },
  { id: '9', name: 'Nexus Group', sales: 210000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo circle' },
  { id: '10', name: 'Horizon Dynamics', sales: 390000, logoUrl: 'https://placehold.co/40x40.png', hint: 'logo arrow' },
];

export default function CompaniesPage() {
  return <CompanyList companies={MOCK_COMPANIES} />;
}
