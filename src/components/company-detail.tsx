
'use client';

import * as React from 'react';
import type { AllowedCompany, Merchant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MerchantList from './merchant-list';

export default function AllowedCompanyDetail({ allowedCompany, merchants }: { allowedCompany: AllowedCompany, merchants: Merchant[] }) {
    
  const getStatusVariant = (status: AllowedCompany['STATUS']) => {
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
              <CardTitle className="text-3xl">{allowedCompany.FIELDNAME}</CardTitle>
              <CardDescription>ACCOUNTNUMBER: {allowedCompany.ACCOUNTNUMBER}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
                <p className="text-sm font-medium text-muted-foreground">STATUS</p>
                <Badge variant={getStatusVariant(allowedCompany.STATUS)}>{allowedCompany.STATUS}</Badge>
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
                <p className="text-sm font-medium text-muted-foreground">INSERTDATE</p>
                <p>{new Date(allowedCompany.INSERTDATE).toLocaleDateString()}</p>
            </div>
             <div>
                <p className="text-sm font-medium text-muted-foreground">UPDATEDATE</p>
                <p>{new Date(allowedCompany.UPDATEDATE).toLocaleDateString()}</p>
            </div>
             <div>
                <p className="text-sm font-medium text-muted-foreground">INSERTUSER</p>
                <p>{allowedCompany.INSERTUSER}</p>
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">UPDATEUSER</p>
                <p>{allowedCompany.UPDATEUSER}</p>
            </div>
        </CardContent>
      </Card>
      
      <MerchantList merchants={merchants} />
    </div>
  );
}
