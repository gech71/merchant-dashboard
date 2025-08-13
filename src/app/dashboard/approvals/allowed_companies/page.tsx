
'use client'
import AllowedCompanyList from '@/components/allowed-company-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type AllowedCompanyWithRelations = Prisma.allowed_companiesGetPayload<{
  include: {}
}>

export default function CompaniesApprovalPage() {
  const { allowedCompanies, currentUser } = useDataContext();
  // Filter for companies that are not yet approved
  const pendingCompanies = allowedCompanies.filter(c => !c.APPROVED);
  return <AllowedCompanyList allowedCompanies={pendingCompanies as unknown as AllowedCompanyWithRelations[]} approvalView={true} />;
}
