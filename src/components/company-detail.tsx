
'use client';

import * as React from 'react';
import type { Company, Merchant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MerchantList from './merchant-list';

export default function CompanyDetail({ company, merchants }: { company: Company, merchants: Merchant[] }) {
    
  const getStatusVariant = (status: Company['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };
    
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-3xl">{company.fieldName}</CardTitle>
              <CardDescription>Account Number: {company.accountNumber} | Branch: {company.branch}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={getStatusVariant(company.status)}>{company.status}</Badge>
           </div>
           <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <Badge variant={company.approved ? 'default' : 'secondary'}>{company.approved ? 'Yes' : 'No'}</Badge>
           </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">Approved By</p>
                <p>{company.approveUser || 'N/A'}</p>
            </div>
        </CardContent>
      </Card>
      
      <MerchantList merchants={merchants} />
    </div>
  );
}
