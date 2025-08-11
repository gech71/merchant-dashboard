

import CompanyList from '@/components/company-list';
import type { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  { id: '3', accountNumber: 'ACC003', fieldName: 'Quantum Corp', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern', status: 'Pending' },
  { id: '7', accountNumber: 'ACC007', fieldName: 'Starlight Co.', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric', status: 'Pending' },
];

export default function CompaniesApprovalPage() {
  const pendingCompanies = MOCK_COMPANIES.filter(c => c.status === 'Pending');
  return <CompanyList companies={pendingCompanies} approvalView={true} />;
}
