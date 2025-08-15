
'use client';

import * as React from 'react';
import type { paystream_txns } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortableKeys = 'MERCHANTACCOUNTNUMBER' | 'SALERPHONENUMBER' | 'TICKET' | 'AMOUNT' | 'INSERTDATE';
const ITEMS_PER_PAGE = 15;

export default function PaystreamTxnList({ paystreamTxns: initialPaystreamTxns }: { paystreamTxns: paystream_txns[] }) {
  const { merchants, allowedCompanies } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'INSERTDATE', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [companyFilter, setCompanyFilter] = React.useState('all');
  const [searchField, setSearchField] = React.useState('all');

  const getCompanyName = (accountNumber: string | null) => {
    if (!accountNumber) return 'N/A';
    const company = allowedCompanies.find(c => c.ACCOUNTNUMBER === accountNumber);
    return company ? company.FIELDNAME : 'N/A';
  }
  
  const getSalerName = (phoneNumber: string | null) => {
    if (!phoneNumber) return 'N/A';
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

  const filteredAndSortedTxns = React.useMemo(() => {
    let sortableItems = [...initialPaystreamTxns];
    
    if (companyFilter !== 'all') {
        sortableItems = sortableItems.filter(txn => txn.MERCHANTACCOUNTNUMBER === companyFilter);
    }

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((txn) => {
          if (searchField === 'all') {
            return getCompanyName(txn.MERCHANTACCOUNTNUMBER).toLowerCase().includes(lowercasedTerm) ||
                   getSalerName(txn.SALERPHONENUMBER).toLowerCase().includes(lowercasedTerm) ||
                   Object.values(txn).some(val => String(val).toLowerCase().includes(lowercasedTerm));
          }
          if (searchField === 'company') {
            return getCompanyName(txn.MERCHANTACCOUNTNUMBER).toLowerCase().includes(lowercasedTerm);
          }
          if (searchField === 'saler') {
            return getSalerName(txn.SALERPHONENUMBER).toLowerCase().includes(lowercasedTerm);
          }
           const fieldValue = txn[searchField as keyof paystream_txns] as string;
           return fieldValue?.toLowerCase().includes(lowercasedTerm);
        });
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
  }, [initialPaystreamTxns, searchTerm, sortConfig, allowedCompanies, merchants, companyFilter, searchField]);

  const paginatedTxns = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedTxns.slice(startIndex, endIndex);
  }, [filteredAndSortedTxns, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>PayStream Transactions</CardTitle>
        <CardDescription>
          A log of all transactions processed via PayStream.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 py-4">
           <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {allowedCompanies.map(company => (
                      <SelectItem key={company.Oid} value={company.ACCOUNTNUMBER}>{company.FIELDNAME}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
                <Select value={searchField} onValueChange={setSearchField}>
                    <SelectTrigger className="h-9 w-[150px]">
                        <SelectValue placeholder="Search by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="company">Company</SelectItem>
                        <SelectItem value="saler">Saler</SelectItem>
                        <SelectItem value="TICKET">Ticket</SelectItem>
                        <SelectItem value="PAYERACCOUNT">Payer Account</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 max-w-sm"
                />
            </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('MERCHANTACCOUNTNUMBER')} className="px-2">Company{getSortIndicator('MERCHANTACCOUNTNUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('SALERPHONENUMBER')} className="px-2">Saler{getSortIndicator('SALERPHONENUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('TICKET')} className="px-2">Ticket{getSortIndicator('TICKET')}</Button></TableHead>
                <TableHead>Is Completed</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">Amount{getSortIndicator('AMOUNT')}</Button></TableHead>
                <TableHead>Payer Account</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('INSERTDATE')} className="px-2">Date{getSortIndicator('INSERTDATE')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTxns.length > 0 ? (
                paginatedTxns.map((txn) => (
                  <TableRow key={txn.ID}>
                    <TableCell className="font-medium">{getCompanyName(txn.MERCHANTACCOUNTNUMBER)}</TableCell>
                    <TableCell>{getSalerName(txn.SALERPHONENUMBER)}</TableCell>
                    <TableCell>{txn.TICKET}</TableCell>
                    <TableCell><Badge variant={txn.ISCOMPLETED ? 'default' : 'secondary'}>{txn.ISCOMPLETED ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell className="text-right">{txn.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell>{txn.PAYERACCOUNT || 'N/A'}</TableCell>
                    <TableCell>{txn.INSERTDATE ? new Date(txn.INSERTDATE).toLocaleString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
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
