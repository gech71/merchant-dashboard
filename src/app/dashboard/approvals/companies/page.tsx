
'use client'
import CompanyList from '@/components/company-list';
import { useDataContext } from '@/context/data-context';

export default function CompaniesApprovalPage() {
  const { companies, currentUser } = useDataContext();
  const pendingCompanies = companies.filter(c => c.status === 'Pending' && c.branch === currentUser.branch);
  return <CompanyList companies={pendingCompanies} approvalView={true} />;
}
