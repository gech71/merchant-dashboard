
'use client';

import * as React from 'react';
import type { allowed_companies, Merchant_users } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MerchantList from './merchant-list';

export default function AllowedCompanyDetail({ allowedCompany, merchants }: { allowedCompany: allowed_companies, merchants: Merchant_users[] }) {
    
  const getStatusVariant = (status: boolean) => {
    return status ? 'default' : 'secondary';
  };
    
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-3xl">{allowedCompany.FIELDNAME}</CardTitle>
              <CardDescription>ID: {allowedCompany.ID} | ACCOUNTNUMBER: {allowedCompany.ACCOUNTNUMBER}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Oid</p>
                <p>{allowedCompany.Oid}</p>
            </div>
           <div>
                <p className="text-sm font-medium text-muted-foreground">STATUS</p>
                <Badge variant={getStatusVariant(allowedCompany.STATUS)}>{allowedCompany.STATUS ? 'Active' : 'Inactive'}</Badge>
           </div>
           <div>
                <p className="text-sm font-medium text-muted-foreground">APPROVED</p>
                <Badge variant={allowedCompany.APPROVED ? 'default' : 'secondary'}>{allowedCompany.APPROVED ? 'Yes' : 'No'}</Badge>
           </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">APPROVEUSER</p>
                <p>{allowedCompany.APPROVEUSER || 'N/A'}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">OptimisticLockField</p>
                <p>{allowedCompany.OptimisticLockField}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">GCRecord</p>
                <p>{allowedCompany.GCRecord}</p>
            </div>
        </CardContent>
      </Card>
      
      <MerchantList merchants={merchants} />
    </div>
  );
}
