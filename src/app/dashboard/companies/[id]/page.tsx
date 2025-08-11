
'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useDataContext } from '@/context/data-context';
import CompanyDetail from '@/components/company-detail';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const { companies, merchants } = useDataContext();

  const companyId = Array.isArray(id) ? id[0] : id;

  const company = companies.find((c) => c.id === companyId);
  const companyMerchants = merchants.filter((m) => m.company === company?.fieldName);

  if (!company) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Not Found</CardTitle>
                <CardDescription>The company you are looking for does not exist.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return <CompanyDetail company={company} merchants={companyMerchants} />;
}
