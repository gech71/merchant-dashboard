
'use client';
import AllowedCompanyList from '@/components/allowed-company-list';
import { useDataContext } from '@/context/data-context';

export default function CompaniesPage() {
  const { allowedCompanies } = useDataContext();
  return <AllowedCompanyList allowedCompanies={allowedCompanies} />;
}
