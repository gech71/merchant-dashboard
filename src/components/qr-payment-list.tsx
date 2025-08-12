
'use client';

import * as React from 'react';
import type { qr_payments } from '@/types';
import { ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/context/data-context';

type SortableKeys = 'DEBITACCOUNT' | 'CREDITACCOUNT' | 'SALERPHONENUMBER' | 'AMOUNT' | 'EXPIRETIME' | 'ISUSED' | 'INSERTDATE';
const ITEMS_PER_PAGE = 15;

export default function QrPaymentList({ qrPayments: initialQrPayments }: { qrPayments: qr_payments[] }) {
  const { merchants } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'INSERTDATE', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  
  const getSalerName = (phoneNumber: string) => {
    const merchant = merchants.find(m => m.PHONENUMBER === phoneNumber);
    return merchant ? merchant.FULLNAME : 'N/A';
  }

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedPayments = React.useMemo(() => {
    let sortableItems = [...initialQrPayments];

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((payment) =>
            Object.values(payment).some(val => String(val).toLowerCase().includes(lowercasedTerm)) ||
            getSalerName(payment.SALERPHONENUMBER).toLowerCase().includes(lowercasedTerm)
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        
        if (typeof valA === 'boolean' && typeof valB === 'boolean') {
          return sortConfig.direction === 'ascending' ? (valA === valB ? 0 : valA ? -1 : 1) : (valA === valB ? 0 : valA ? 1 : -1)
        }

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [initialQrPayments, searchTerm, sortConfig, merchants]);

  const paginatedPayments = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPayments.slice(startIndex, endIndex);
  }, [filteredAndSortedPayments, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Payments</CardTitle>
        <CardDescription>
          A log of all generated QR code payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search QR payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('DEBITACCOUNT')} className="px-2">DEBITACCOUNT{getSortIndicator('DEBITACCOUNT')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('CREDITACCOUNT')} className="px-2">CREDITACCOUNT{getSortIndicator('CREDITACCOUNT')}</Button></TableHead>
                <TableHead>Saler</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('SALERPHONENUMBER')} className="px-2">SALERPHONENUMBER{getSortIndicator('SALERPHONENUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">AMOUNT{getSortIndicator('AMOUNT')}</Button></TableHead>
                <TableHead>QRCODE</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('ISUSED')} className="px-2">ISUSED{getSortIndicator('ISUSED')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('EXPIRETIME')} className="px-2">EXPIRETIME{getSortIndicator('EXPIRETIME')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => (
                  <TableRow key={payment.ID}>
                    <TableCell>{payment.DEBITACCOUNT}</TableCell>
                    <TableCell>{payment.CREDITACCOUNT}</TableCell>
                    <TableCell>{getSalerName(payment.SALERPHONENUMBER)}</TableCell>
                    <TableCell>{payment.SALERPHONENUMBER}</TableCell>
                    <TableCell className="text-right">{payment.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell className="font-mono text-xs">{payment.QRCODE}</TableCell>
                    <TableCell><Badge variant={payment.ISUSED ? 'default' : 'secondary'}>{payment.ISUSED ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell>{new Date(payment.EXPIRETIME).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No QR payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground">
              Showing <strong>{paginatedPayments.length}</strong> of <strong>{filteredAndSortedPayments.length}</strong> payments
          </div>
          <div className="ml-auto flex items-center gap-2">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
              >
                  Previous
              </Button>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedPayments.length}
              >
                  Next
              </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
