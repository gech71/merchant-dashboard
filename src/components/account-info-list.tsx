
'use client';

import * as React from 'react';
import type { account_infos } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortableKeys = 'ACCOUNTNUMBER' | 'PHONENUMBER' | 'FULLNAME' | 'GENDER';
const ITEMS_PER_PAGE = 15;

export default function AccountInfoList({ accountInfos: initialAccountInfos }: { accountInfos: account_infos[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [accountFilter, setAccountFilter] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'FULLNAME', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const uniqueAccountNumbers = React.useMemo(() => {
    const accounts = new Set(initialAccountInfos.map(info => info.ACCOUNTNUMBER));
    return Array.from(accounts);
  }, [initialAccountInfos]);

  const filteredAndSortedInfos = React.useMemo(() => {
    let sortableItems = [...initialAccountInfos];
    
    if (accountFilter !== 'all') {
      sortableItems = sortableItems.filter(info => info.ACCOUNTNUMBER === accountFilter);
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((info) => {
        if (searchField === 'all') {
          return (
            info.FULLNAME.toLowerCase().includes(lowercasedTerm) ||
            info.ACCOUNTNUMBER.toLowerCase().includes(lowercasedTerm) ||
            info.PHONENUMBER.toLowerCase().includes(lowercasedTerm) ||
            info.GENDER.toLowerCase().includes(lowercasedTerm)
          );
        }
        const fieldValue = info[searchField as keyof account_infos] as string;
        return fieldValue?.toLowerCase().includes(lowercasedTerm);
      });
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [initialAccountInfos, searchTerm, searchField, accountFilter, sortConfig]);

  const paginatedInfos = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedInfos.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedInfos, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>A list of all account information records.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2 py-4">
           <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Filter by Account" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {uniqueAccountNumbers.map(acc => (
                      <SelectItem key={acc} value={acc}>{acc}</SelectItem>
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
                    <SelectItem value="FULLNAME">Full Name</SelectItem>
                    <SelectItem value="ACCOUNTNUMBER">Account Number</SelectItem>
                    <SelectItem value="PHONENUMBER">Phone Number</SelectItem>
                    <SelectItem value="GENDER">Gender</SelectItem>
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
                <TableHead><Button variant="ghost" onClick={() => requestSort('FULLNAME')} className="px-2">Full Name{getSortIndicator('FULLNAME')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('ACCOUNTNUMBER')} className="px-2">Account Number{getSortIndicator('ACCOUNTNUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('PHONENUMBER')} className="px-2">Phone Number{getSortIndicator('PHONENUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('GENDER')} className="px-2">Gender{getSortIndicator('GENDER')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInfos.length > 0 ? (
                paginatedInfos.map((info) => (
                  <TableRow key={info.ID}>
                    <TableCell className="font-medium">{info.FULLNAME}</TableCell>
                    <TableCell>{info.ACCOUNTNUMBER}</TableCell>
                    <TableCell>{info.PHONENUMBER}</TableCell>
                    <TableCell>{info.GENDER}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No records found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{paginatedInfos.length}</strong> of <strong>{filteredAndSortedInfos.length}</strong> records
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
            disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedInfos.length}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
