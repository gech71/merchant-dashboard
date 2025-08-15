
'use client';

import * as React from 'react';
import type { merchant_txns } from '@/types';
import { ArrowUpDown, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortableKeys = 'MERCHANTACCOUNT' | 'AMOUNT' | 'STATUS' | 'T2TRANSACTIONDATE' | 'CUSTOMERNAME' | 'CUSTOMERACCOUNT' | 'TXNID' | 'T24USER' | 'TRANSACTIONCHANNEL' | 'TRANSACTIONSERVICE';
const ITEMS_PER_PAGE = 15;

export default function MerchantTxnList({ merchantTxns: initialMerchantTxns }: { merchantTxns: merchant_txns[] }) {
  const { allowedCompanies, merchants } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'T2TRANSACTIONDATE', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [companyFilter, setCompanyFilter] = React.useState('all');
  const [searchField, setSearchField] = React.useState('all');

  const getCompanyName = (accountNumber: string | null) => {
    if (!accountNumber) return 'N/A';
    const company = allowedCompanies.find(c => c.ACCOUNTNUMBER === accountNumber);
    return company ? company.FIELDNAME : 'N/A';
  }
  
  const getMerchantName = (phoneNumber: string | null) => {
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
    
    if (date?.from) {
      sortableItems = sortableItems.filter(txn => {
          if (!txn.T2TRANSACTIONDATE) return false;
          const txnDate = new Date(txn.T2TRANSACTIONDATE);
          if (date.from && !date.to) {
              return txnDate >= date.from;
          }
          if (date.from && date.to) {
              const toDate = new Date(date.to);
              toDate.setHours(23, 59, 59, 999);
              return txnDate >= date.from && txnDate <= toDate;
          }
          return true;
      });
    }

    if (companyFilter !== 'all') {
        sortableItems = sortableItems.filter(txn => txn.MERCHANTACCOUNT === companyFilter);
    }

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((txn) => {
            const companyName = getCompanyName(txn.MERCHANTACCOUNT).toLowerCase();
            const merchantName = getMerchantName(txn.MERCHANTPHONE).toLowerCase();
            if (searchField === 'all') {
                return companyName.includes(lowercasedTerm) ||
                       merchantName.includes(lowercasedTerm) ||
                       Object.values(txn).some(val => String(val).toLowerCase().includes(lowercasedTerm))
            }
             if (searchField === 'company') {
                return companyName.includes(lowercasedTerm);
            }
             if (searchField === 'merchant') {
                return merchantName.includes(lowercasedTerm);
            }
            const fieldValue = txn[searchField as keyof merchant_txns] as string;
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
  }, [initialMerchantTxns, searchTerm, sortConfig, date, companyFilter, searchField, allowedCompanies, merchants]);

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
        <div className="flex flex-wrap items-center justify-between gap-2 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "h-9 w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[180px] lg:w-[200px]">
                <SelectValue placeholder="Filter by company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {allowedCompanies.map(company => (
                  <SelectItem key={company.Oid} value={company.ACCOUNTNUMBER}>
                    {company.FIELDNAME}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="company">Company Name</SelectItem>
                <SelectItem value="merchant">Merchant Name</SelectItem>
                <SelectItem value="CUSTOMERNAME">Customer Name</SelectItem>
                <SelectItem value="CUSTOMERACCOUNT">Customer Account</SelectItem>
                <SelectItem value="TXNID">Transaction ID</SelectItem>
                <SelectItem value="T24USER">T24 User</SelectItem>
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
                <TableHead>Company Name</TableHead>
                <TableHead>Merchant Name</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">
                    Amount
                    {getSortIndicator('AMOUNT')}
                  </Button>
                </TableHead>
                 <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('STATUS')} className="px-2">
                    Status
                    {getSortIndicator('STATUS')}
                  </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('TXNID')} className="px-2">
                        Transaction ID
                        {getSortIndicator('TXNID')}
                    </Button>
                </TableHead>
                <TableHead>
                     <Button variant="ghost" onClick={() => requestSort('CUSTOMERNAME')} className="px-2">
                        Customer Name
                        {getSortIndicator('CUSTOMERNAME')}
                    </Button>
                </TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('CUSTOMERACCOUNT')} className="px-2">
                        Customer Account
                        {getSortIndicator('CUSTOMERACCOUNT')}
                    </Button>
                 </TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('T24USER')} className="px-2">
                        T24 User
                        {getSortIndicator('T24USER')}
                    </Button>
                 </TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('TRANSACTIONCHANNEL')} className="px-2">
                        Channel
                        {getSortIndicator('TRANSACTIONCHANNEL')}
                    </Button>
                 </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('TRANSACTIONSERVICE')} className="px-2">
                        Service
                        {getSortIndicator('TRANSACTIONSERVICE')}
                    </Button>
                 </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('T2TRANSACTIONDATE')} className="px-2">
                    Transaction Date
                    {getSortIndicator('T2TRANSACTIONDATE')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTxns.length > 0 ? (
                paginatedTxns.map((txn) => (
                  <TableRow key={txn.ID}>
                    <TableCell className="font-medium whitespace-nowrap">{getCompanyName(txn.MERCHANTACCOUNT)}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{getMerchantName(txn.MERCHANTPHONE)}</TableCell>
                    <TableCell className="text-right">{txn.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(txn.STATUS)}>{txn.STATUS}</Badge>
                    </TableCell>
                    <TableCell>{txn.TXNID}</TableCell>
                    <TableCell>{txn.CUSTOMERNAME}</TableCell>
                    <TableCell>{txn.CUSTOMERACCOUNT}</TableCell>
                    <TableCell>{txn.T24USER}</TableCell>
                    <TableCell>{txn.TRANSACTIONCHANNEL}</TableCell>
                    <TableCell>{txn.TRANSACTIONSERVICE}</TableCell>
                    <TableCell>{txn.T2TRANSACTIONDATE ? new Date(txn.T2TRANSACTIONDATE).toLocaleString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center">
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
