
'use client';

import * as React from 'react';
import type { paystream_txns } from '@/types';
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
  const [date, setDate] = React.useState<DateRange | undefined>();

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
    
     if (date?.from) {
      sortableItems = sortableItems.filter(txn => {
          if (!txn.INSERTDATE) return false;
          const txnDate = new Date(txn.INSERTDATE);
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
  }, [initialPaystreamTxns, searchTerm, sortConfig, allowedCompanies, merchants, companyFilter, searchField, date]);

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
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                            </>
                            ) : (
                            format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Filter by Insert Date</span>
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
            </div>
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
                <TableHead>Company</TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('MERCHANTACCOUNTNUMBER')} className="px-2">Merchant Acct.{getSortIndicator('MERCHANTACCOUNTNUMBER')}</Button></TableHead>
                <TableHead>Saler</TableHead>
                <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('SALERPHONENUMBER')} className="px-2">Saler Phone{getSortIndicator('SALERPHONENUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('TICKET')} className="px-2">Ticket{getSortIndicator('TICKET')}</Button></TableHead>
                <TableHead>Completed</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('AMOUNT')} className="px-2">Amount{getSortIndicator('AMOUNT')}</Button></TableHead>
                <TableHead className="whitespace-nowrap">Payer Account</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('INSERTDATE')} className="px-2">Date{getSortIndicator('INSERTDATE')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTxns.length > 0 ? (
                paginatedTxns.map((txn) => (
                  <TableRow key={txn.ID}>
                    <TableCell>{getCompanyName(txn.MERCHANTACCOUNTNUMBER)}</TableCell>
                    <TableCell className="font-medium">{txn.MERCHANTACCOUNTNUMBER}</TableCell>
                    <TableCell>{getSalerName(txn.SALERPHONENUMBER)}</TableCell>
                    <TableCell>{txn.SALERPHONENUMBER}</TableCell>
                    <TableCell>{txn.TICKET}</TableCell>
                    <TableCell><Badge variant={txn.ISCOMPLETED ? 'default' : 'secondary'}>{txn.ISCOMPLETED ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell className="text-right">{txn.AMOUNT.toFixed(2)}</TableCell>
                    <TableCell>{txn.PAYERACCOUNT || 'N/A'}</TableCell>
                    <TableCell>{txn.INSERTDATE ? new Date(txn.INSERTDATE).toLocaleString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
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
