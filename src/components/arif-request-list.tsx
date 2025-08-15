
'use client';

import * as React from 'react';
import type { arif_requests } from '@/types';
import { ArrowUpDown } from 'lucide-react';
import { useDataContext } from '@/context/data-context';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortableKeys = 'MERCHANTACCOUNT' | 'AMOUNT' | 'DATESEND1' | 'ARIFPAYTRANSACTIONSTATUS' | 'T24TRANSACTIONSTATUS' | 'DEBITACCOUNT' | 'CREDITACCOUNT' | 'T24TRANSACTIONID' | 'SESSIONID' | 'SALESPHONE';
const ITEMS_PER_PAGE = 10;

export default function ArifRequestList({ arifRequests: initialArifRequests }: { arifRequests: arif_requests[] }) {
  const { merchants, allowedCompanies } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [companyFilter, setCompanyFilter] = React.useState('all');
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
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getStatusVariant = (status: string | null) => {
    if (!status) return 'outline';
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
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
    
    if (companyFilter !== 'all') {
        sortableItems = sortableItems.filter(req => req.MERCHANTACCOUNT === companyFilter);
    }

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((req) => {
          if (searchField === 'all') {
            return getMerchantName(req.MERCHANTACCOUNT).toLowerCase().includes(lowercasedTerm) ||
                   Object.values(req).some(val => String(val).toLowerCase().includes(lowercasedTerm))
          }
          const fieldValue = req[searchField as keyof arif_requests] as string;
          return fieldValue?.toLowerCase().includes(lowercasedTerm);
        });
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [initialArifRequests, searchTerm, searchField, companyFilter, sortConfig, merchants]);

  const paginatedRequests = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedRequests, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const truncate = (str: string | null, num: number) => {
    if (!str) return 'N/A';
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>ArifPay Requests</CardTitle>
        <CardDescription>A log of all transaction requests made via ArifPay gateway.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="h-9 w-full sm:w-[180px] lg:w-[200px]">
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
                    <SelectTrigger className="h-9 w-[180px]">
                        <SelectValue placeholder="Search by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="NONCEID">Nonce ID</SelectItem>
                        <SelectItem value="SESSIONID">Session ID</SelectItem>
                        <SelectItem value="DEBITACCOUNT">Debit Account</SelectItem>
                        <SelectItem value="CREDITACCOUNT">Credit Account</SelectItem>
                        <SelectItem value="MERCHANTACCOUNT">Merchant Account</SelectItem>
                        <SelectItem value="ARIFPAYTRANSACTIONID">ArifPay Txn ID</SelectItem>
                        <SelectItem value="T24TRANSACTIONID">T24 Txn ID</SelectItem>
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
                <TableHead className="whitespace-nowrap">Merchant Name</TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('DEBITACCOUNT')} className="px-2">Debit Account{getSortIndicator('DEBITACCOUNT')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('CREDITACCOUNT')} className="px-2">Credit Account{getSortIndicator('CREDITACCOUNT')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">Amount{getSortIndicator('AMOUNT')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('ARIFPAYTRANSACTIONID')} className="px-2">ArifPay Txn ID{getSortIndicator('ARIFPAYTRANSACTIONID')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('T24TRANSACTIONID')} className="px-2">T24 Txn ID{getSortIndicator('T24TRANSACTIONID')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('ARIFPAYTRANSACTIONSTATUS')} className="px-2">ArifPay Status{getSortIndicator('ARIFPAYTRANSACTIONSTATUS')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('T24TRANSACTIONSTATUS')} className="px-2">T24 Status{getSortIndicator('T24TRANSACTIONSTATUS')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('DATESEND1')} className="px-2">Initial Request Date{getSortIndicator('DATESEND1')}</Button></TableHead>
                <TableHead className="whitespace-nowrap">Nonce ID</TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('SESSIONID')} className="px-2">Session ID{getSortIndicator('SESSIONID')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('MERCHANTACCOUNT')} className="px-2">Merchant Account{getSortIndicator('MERCHANTACCOUNT')}</Button></TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('SALESPHONE')} className="px-2">Sales Phone{getSortIndicator('SALESPHONE')}</Button></TableHead>
                <TableHead className="whitespace-nowrap">Webhook Response</TableHead>
                <TableHead className="whitespace-nowrap">Request 1</TableHead>
                <TableHead className="whitespace-nowrap">Response 1</TableHead>
                <TableHead className="whitespace-nowrap">Request 2</TableHead>
                <TableHead className="whitespace-nowrap">Response 2</TableHead>
                <TableHead className="whitespace-nowrap">Request 3</TableHead>
                <TableHead className="whitespace-nowrap">Response 3</TableHead>
                <TableHead className="whitespace-nowrap">Error 1</TableHead>
                <TableHead className="whitespace-nowrap">Message 1</TableHead>
                <TableHead className="whitespace-nowrap">Error 2</TableHead>
                <TableHead className="whitespace-nowrap">Message 2</TableHead>
                <TableHead className="whitespace-nowrap">Error 3</TableHead>
                <TableHead className="whitespace-nowrap">Message 3</TableHead>
                <TableHead className="whitespace-nowrap">Date Sent 1</TableHead>
                <TableHead className="whitespace-nowrap">Date Received 1</TableHead>
                <TableHead className="whitespace-nowrap">Date Sent 2</TableHead>
                <TableHead className="whitespace-nowrap">Date Received 2</TableHead>
                <TableHead className="whitespace-nowrap">Date Sent 3</TableHead>
                <TableHead className="whitespace-nowrap">Date Received 3</TableHead>
                <TableHead className="whitespace-nowrap">Webhook Date</TableHead>
                <TableHead className="whitespace-nowrap">Insert User</TableHead>
                <TableHead className="whitespace-nowrap">Update User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((req) => (
                  <TableRow key={req.NONCEID}>
                    <TableCell className="font-medium whitespace-nowrap">{getMerchantName(req.MERCHANTACCOUNT)}</TableCell>
                    <TableCell>{req.DEBITACCOUNT}</TableCell>
                    <TableCell>{req.CREDITACCOUNT}</TableCell>
                    <TableCell className="text-right">{req.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell>{req.ARIFPAYTRANSACTIONID}</TableCell>
                    <TableCell>{req.T24TRANSACTIONID || 'N/A'}</TableCell>
                    <TableCell><Badge variant={getStatusVariant(req.ARIFPAYTRANSACTIONSTATUS)}>{req.ARIFPAYTRANSACTIONSTATUS || 'N/A'}</Badge></TableCell>
                    <TableCell><Badge variant={getStatusVariant(req.T24TRANSACTIONSTATUS)}>{req.T24TRANSACTIONSTATUS || 'N/A'}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATESEND1 ? new Date(req.DATESEND1).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>{truncate(req.NONCEID, 15)}</TableCell>
                    <TableCell>{truncate(req.SESSIONID, 15)}</TableCell>
                    <TableCell>{req.MERCHANTACCOUNT}</TableCell>
                    <TableCell>{req.SALESPHONE}</TableCell>
                    <TableCell>{truncate(req.WEBHOOKRESPONSE, 20)}</TableCell>
                    <TableCell>{truncate(req.REQUEST1, 20)}</TableCell>
                    <TableCell>{truncate(req.RESPONSE1, 20)}</TableCell>
                    <TableCell>{truncate(req.REQUEST2, 20)}</TableCell>
                    <TableCell>{truncate(req.RESPONSE2, 20)}</TableCell>
                    <TableCell>{truncate(req.REQUEST3, 20)}</TableCell>
                    <TableCell>{truncate(req.RESPONSE3, 20)}</TableCell>
                    <TableCell>{truncate(req.ERROR1, 20)}</TableCell>
                    <TableCell>{truncate(req.MESSAGE1, 20)}</TableCell>
                    <TableCell>{truncate(req.ERROR2, 20)}</TableCell>
                    <TableCell>{truncate(req.MESSAGE2, 20)}</TableCell>
                    <TableCell>{truncate(req.ERROR3, 20)}</TableCell>
                    <TableCell>{truncate(req.MESSAGE3, 20)}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATESEND1 ? new Date(req.DATESEND1).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATERECIVED1 ? new Date(req.DATERECIVED1).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATESEND2 ? new Date(req.DATESEND2).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATERECIVED2 ? new Date(req.DATERECIVED2).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATESEND3 ? new Date(req.DATESEND3).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.DATERECIVED3 ? new Date(req.DATERECIVED3).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell className="whitespace-nowrap">{req.WEBHOOKRECEIVEDDATE ? new Date(req.WEBHOOKRECEIVEDDATE).toLocaleString() : 'N/A'}</TableCell>
                    <TableCell>{req.INSERTUSER}</TableCell>
                    <TableCell>{req.UPDATEUSER}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={35} className="h-24 text-center">
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
