
'use client'
import AllowedCompanyList from '@/components/allowed-company-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type AllowedCompanyWithRelations = Prisma.allowed_companiesGetPayload<{
  include: {}
}>

export default function CompaniesApprovalPage() {
  const { allowedCompanies, currentUser } = useDataContext();
  // This logic is flawed as there is no direct link between company and branch
  // For the purpose of this demo, we assume a company is in a branch if a merchant of that company is in a branch user's branch
  const pendingCompanies = allowedCompanies.filter(c => c.STATUS === 'Pending');
  return <AllowedCompanyList allowedCompanies={pendingCompanies as unknown as AllowedCompanyWithRelations[]} approvalView={true} />;
}
