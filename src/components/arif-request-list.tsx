
'use client';

import * as React from 'react';
import type { arif_requests } from '@/types';
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

type SortableKeys = 'MERCHANTACCOUNT' | 'AMOUNT' | 'DATESEND1' | 'ARIFPAYTRANSACTIONSTATUS' | 'T24TRANSACTIONSTATUS' | 'DEBITACCOUNT' | 'CREDITACCOUNT' | 'T24TRANSACTIONID';
const ITEMS_PER_PAGE = 15;

export default function ArifRequestList({ arifRequests: initialArifRequests }: { arifRequests: arif_requests[] }) {
  const { merchants } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'DATESEND1', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);

  const getMerchantName = (accountNumber: string) => {
    const merchant = merchants.find(m => m.ACCOUNTNUMBER === accountNumber);
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

  const getStatusVariant = (status: string | null) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredAndSortedRequests = React.useMemo(() => {
    let sortableItems = [...initialArifRequests];

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((req) =>
            getMerchantName(req.MERCHANTACCOUNT).toLowerCase().includes(lowercasedTerm) ||
            Object.values(req).some(val => String(val).toLowerCase().includes(lowercasedTerm))
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';

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
  }, [initialArifRequests, searchTerm, sortConfig]);

  const paginatedRequests = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedRequests.slice(startIndex, endIndex);
  }, [filteredAndSortedRequests, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return sortConfig.direction === 'ascending' ? (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    ) : (
      <ArrowUpDown className="ml-2 h-4 w-4" />
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ArifPay Requests</CardTitle>
        <CardDescription>
          A log of all transaction requests made via ArifPay gateway.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Merchant Name</TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('MERCHANTACCOUNT')} className="px-2">
                        Merchant Account
                        {getSortIndicator('MERCHANTACCOUNT')}
                    </Button>
                </TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('DEBITACCOUNT')} className="px-2">
                        Debit Account
                        {getSortIndicator('DEBITACCOUNT')}
                    </Button>
                </TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('CREDITACCOUNT')} className="px-2">
                        Credit Account
                        {getSortIndicator('CREDITACCOUNT')}
                    </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">
                    Amount
                    {getSortIndicator('AMOUNT')}
                  </Button>
                </TableHead>
                <TableHead>ArifPay Txn ID</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('ARIFPAYTRANSACTIONSTATUS')} className="px-2">
                    ArifPay Status
                    {getSortIndicator('ARIFPAYTRANSACTIONSTATUS')}
                  </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('T24TRANSACTIONID')} className="px-2">
                        T24 Txn ID
                        {getSortIndicator('T24TRANSACTIONID')}
                    </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('T24TRANSACTIONSTATUS')} className="px-2">
                        T24 Status
                        {getSortIndicator('T24TRANSACTIONSTATUS')}
                    </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('DATESEND1')} className="px-2">
                    Request Date
                    {getSortIndicator('DATESEND1')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <TableRow key={req.NONCEID}>
                    <TableCell className="font-medium">{getMerchantName(req.MERCHANTACCOUNT)}</TableCell>
                    <TableCell>{req.MERCHANTACCOUNT}</TableCell>
                    <TableCell>{req.DEBITACCOUNT}</TableCell>
                    <TableCell>{req.CREDITACCOUNT}</TableCell>
                    <TableCell className="text-right">{req.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell>{req.ARIFPAYTRANSACTIONID}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(req.ARIFPAYTRANSACTIONSTATUS)}>{req.ARIFPAYTRANSACTIONSTATUS || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{req.T24TRANSACTIONID || 'N/A'}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(req.T24TRANSACTIONSTATUS)}>{req.T24TRANSACTIONSTATUS || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>{req.DATESEND1 ? new Date(req.DATESEND1).toLocaleString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="h-24 text-center">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground">
              Showing <strong>{paginatedRequests.length}</strong> of <strong>{filteredAndSortedRequests.length}</strong> requests
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
                  disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedRequests.length}
              >
                  Next
              </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
