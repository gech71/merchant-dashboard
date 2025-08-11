
import CompanyList from '@/components/company-list';
import type { Company } from '@/types';

const MOCK_COMPANIES: Company[] = [
  { id: '3', accountNumber: 'ACC003', fieldName: 'Quantum Corp', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo modern', approved: false, status: 'Pending' },
  { id: '7', accountNumber: 'ACC007', fieldName: 'Starlight Co.', logoUrl: 'https://placehold.co/40x40.png', hint: 'logo geometric', approved: false, status: 'Pending' },
];

export default function CompaniesApprovalPage() {
  return <CompanyList companies={MOCK_COMPANIES} approvalView={true} />;
}
