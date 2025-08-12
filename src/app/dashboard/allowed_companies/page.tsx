
'use client';
import AllowedCompanyList from '@/components/allowed-company-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type AllowedCompanyWithRelations = Prisma.allowed_companiesGetPayload<{
  include: {}
}>

export default function CompaniesPage() {
  const { allowedCompanies } = useDataContext();
  return <AllowedCompanyList allowedCompanies={allowedCompanies as unknown as AllowedCompanyWithRelations[]} />;
}
