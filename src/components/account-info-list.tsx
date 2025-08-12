
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

type SortableKeys = 'ACCOUNTNUMBER' | 'PHONENUMBER' | 'FULLNAME' | 'GENDER';
const ITEMS_PER_PAGE = 15;

export default function AccountInfoList({ accountInfos: initialAccountInfos }: { accountInfos: account_infos[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
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

  const filteredAndSortedInfos = React.useMemo(() => {
    let sortableItems = [...initialAccountInfos];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((info) =>
        Object.values(info).some(val => String(val).toLowerCase().includes(lowercasedTerm))
      );
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
  }, [initialAccountInfos, searchTerm, sortConfig]);

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
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('FULLNAME')} className="px-2">FULLNAME{getSortIndicator('FULLNAME')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('ACCOUNTNUMBER')} className="px-2">ACCOUNTNUMBER{getSortIndicator('ACCOUNTNUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('PHONENUMBER')} className="px-2">PHONENUMBER{getSortIndicator('PHONENUMBER')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('GENDER')} className="px-2">GENDER{getSortIndicator('GENDER')}</Button></TableHead>
                <TableHead>VALUE1</TableHead>
                <TableHead>VALUE2</TableHead>
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
                    <TableCell>{info.VALUE1 || 'N/A'}</TableCell>
                    <TableCell>{info.VALUE2 || 'N/A'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No records found.</TableCell>
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
