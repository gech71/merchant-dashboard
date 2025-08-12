
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useDataContext } from '@/context/data-context';
import AllowedCompanyDetail from '@/components/allowed-company-detail';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { allowedCompanies, merchants } = useDataContext();

  const companyId = Array.isArray(id) ? id[0] : id;

  const company = allowedCompanies.find((c) => c.Oid === companyId);
  const companyMerchants = merchants.filter((m) => m.company === company?.FIELDNAME);

  if (!company) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Allowed Company Not Found</CardTitle>
                <CardDescription>The company you are looking for does not exist.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return <AllowedCompanyDetail allowedCompany={company} merchants={companyMerchants} />;
}
