
'use client';

import * as React from 'react';
import type { merchants_daily_balances } from '@/types';
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
import { useDataContext } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortableKeys = 'MERCHANTACCOUNT' | 'MERCHANTPHONE' | 'DAILYBALANCE' | 'DAILYTXNCOUNT' | 'BALANCEDATE';
const ITEMS_PER_PAGE = 15;

export default function DailyBalanceList({ dailyBalances: initialDailyBalances }: { dailyBalances: merchants_daily_balances[] }) {
  const { merchants, allowedCompanies } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'BALANCEDATE', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [companyFilter, setCompanyFilter] = React.useState('all');
  const [searchField, setSearchField] = React.useState('all');

  const getMerchantName = (accountNumber: string | null) => {
    if (!accountNumber) return 'N/A';
    const company = allowedCompanies.find(c => c.ACCOUNTNUMBER === accountNumber);
    return company ? company.FIELDNAME : 'N/A';
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

  const filteredAndSortedBalances = React.useMemo(() => {
    let sortableItems = [...initialDailyBalances];

    if (companyFilter !== 'all') {
        sortableItems = sortableItems.filter(balance => balance.MERCHANTACCOUNT === companyFilter);
    }

    if (searchTerm) {
        const lowercasedTerm = searchTerm.toLowerCase();
        sortableItems = sortableItems.filter((balance) => {
            if (searchField === 'all') {
                return getMerchantName(balance.MERCHANTACCOUNT).toLowerCase().includes(lowercasedTerm) ||
                       (balance.MERCHANTACCOUNT && balance.MERCHANTACCOUNT.toLowerCase().includes(lowercasedTerm)) ||
                       (balance.MERCHANTPHONE && balance.MERCHANTPHONE.toLowerCase().includes(lowercasedTerm));
            }
            const fieldValue = balance[searchField as keyof merchants_daily_balances] as string;
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
  }, [initialDailyBalances, searchTerm, sortConfig, companyFilter, searchField, allowedCompanies]);

  const paginatedBalances = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedBalances.slice(startIndex, endIndex);
  }, [filteredAndSortedBalances, currentPage]);

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
        <CardTitle>Merchants Daily Balances</CardTitle>
        <CardDescription>
          A log of daily transaction summaries for each merchant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 py-4">
             <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="h-9 w-[180px] lg:w-[200px]">
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
            <div className="flex items-center gap-2">
                 <Select value={searchField} onValueChange={setSearchField}>
                    <SelectTrigger className="h-9 w-[150px]">
                        <SelectValue placeholder="Search by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="MERCHANTACCOUNT">Account No.</SelectItem>
                        <SelectItem value="MERCHANTPHONE">Phone No.</SelectItem>
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
                <TableHead>Merchant Name</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('MERCHANTACCOUNT')} className="px-2">
                    MERCHANTACCOUNT
                    {getSortIndicator('MERCHANTACCOUNT')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('MERCHANTPHONE')} className="px-2">
                    MERCHANTPHONE
                    {getSortIndicator('MERCHANTPHONE')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('DAILYBALANCE')} className="px-2">
                    DAILYBALANCE
                    {getSortIndicator('DAILYBALANCE')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('DAILYTXNCOUNT')} className="px-2">
                    DAILYTXNCOUNT
                    {getSortIndicator('DAILYTXNCOUNT')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => requestSort('BALANCEDATE')} className="px-2">
                    BALANCEDATE
                    {getSortIndicator('BALANCEDATE')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBalances.length > 0 ? (
                paginatedBalances.map((balance) => (
                  <TableRow key={balance.ID}>
                    <TableCell className="font-medium">{getMerchantName(balance.MERCHANTACCOUNT)}</TableCell>
                    <TableCell>{balance.MERCHANTACCOUNT}</TableCell>
                    <TableCell>{balance.MERCHANTPHONE}</TableCell>
                    <TableCell className="text-right">{balance.DAILYBALANCE.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{balance.DAILYTXNCOUNT}</TableCell>
                    <TableCell>{balance.BALANCEDATE ? new Date(balance.BALANCEDATE).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No daily balances found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
          <div className="text-xs text-muted-foreground">
              Showing <strong>{paginatedBalances.length}</strong> of <strong>{filteredAndSortedBalances.length}</strong> records
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
                  disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedBalances.length}
              >
                  Next
              </Button>
          </div>
      </CardFooter>
    </Card>
  );
}
