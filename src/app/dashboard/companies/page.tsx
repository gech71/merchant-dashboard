
'use client';
import CompanyList from '@/components/company-list';
import { useDataContext } from '@/context/data-context';

export default function CompaniesPage() {
  const { companies } = useDataContext();
  return <CompanyList companies={companies} />;
}
