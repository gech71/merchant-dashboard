
'use client';

import * as React from 'react';
import type { merchant_txns } from '@/types';
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

type SortableKeys = 'MERCHANTACCOUNT' | 'AMOUNT' | 'STATUS' | 'T2TRANSACTIONDATE' | 'CUSTOMERNAME' | 'CUSTOMERACCOUNT';
const ITEMS_PER_PAGE = 15;

export default function MerchantTxnList({ merchantTxns: initialMerchantTxns }: { merchantTxns: merchant_txns[] }) {
  const { merchants } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'T2TRANSACTIONDATE', direction: 'descending' });
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

  const getStatusVariant = (status: merchant_txns['STATUS']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredAndSortedTxns = React.useMemo(() => {
    let sortableItems = [...initialMerchantTxns];

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((txn) =>
            getMerchantName(txn.MERCHANTACCOUNT).toLowerCase().includes(lowercasedTerm) ||
            Object.values(txn).some(val => String(val).toLowerCase().includes(lowercasedTerm))
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

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
  }, [initialMerchantTxns, searchTerm, sortConfig]);

  const paginatedTxns = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedTxns.slice(startIndex, endIndex);
  }, [filteredAndSortedTxns, currentPage]);

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
        <CardTitle>Merchant Transactions</CardTitle>
        <CardDescription>
          A log of all transactions processed by merchants.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search transactions..."
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
                        MERCHANTACCOUNT
                        {getSortIndicator('MERCHANTACCOUNT')}
                    </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">
                    AMOUNT
                    {getSortIndicator('AMOUNT')}
                  </Button>
                </TableHead>
                 <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('STATUS')} className="px-2">
                    STATUS
                    {getSortIndicator('STATUS')}
                  </Button>
                </TableHead>
                <TableHead>TXNID</TableHead>
                <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('CUSTOMERNAME')} className="px-2">
                        CUSTOMERNAME
                        {getSortIndicator('CUSTOMERNAME')}
                    </Button>
                </TableHead>
                 <TableHead>CUSTOMERACCOUNT</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('T2TRANSACTIONDATE')} className="px-2">
                    TRANSACTIONDATE
                    {getSortIndicator('T2TRANSACTIONDATE')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTxns.length > 0 ? (
                paginatedTxns.map((txn) => (
                  <TableRow key={txn.ID}>
                    <TableCell className="font-medium">{getMerchantName(txn.MERCHANTACCOUNT)}</TableCell>
                    <TableCell>{txn.MERCHANTACCOUNT}</TableCell>
                    <TableCell className="text-right">{txn.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(txn.STATUS)}>{txn.STATUS}</Badge>
                    </TableCell>
                    <TableCell>{txn.TXNID}</TableCell>
                    <TableCell>{txn.CUSTOMERNAME}</TableCell>
                    <TableCell>{txn.CUSTOMERACCOUNT}</TableCell>
                    <TableCell>{new Date(txn.T2TRANSACTIONDATE).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground">
              Showing <strong>{paginatedTxns.length}</strong> of <strong>{filteredAndSortedTxns.length}</strong> transactions
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
                  disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedTxns.length}
              >
                  Next
              </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
