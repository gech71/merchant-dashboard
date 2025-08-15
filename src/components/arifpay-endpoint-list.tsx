
'use client';

import * as React from 'react';
import type { arifpay_endpoints } from '@/types';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

type SortableKeys = 'BANK' | 'DISPLAYNAME' | 'ORDER' | 'TRANSACTIONTYPE';
const ITEMS_PER_PAGE = 15;

export default function ArifpayEndpointList({ arifpayEndpoints: initialArifpayEndpoints }: { arifpayEndpoints: arifpay_endpoints[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'ORDER', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedEndpoints = React.useMemo(() => {
    let sortableItems = [...initialArifpayEndpoints];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((endpoint) =>
        Object.values(endpoint).some(val => String(val).toLowerCase().includes(lowercasedTerm))
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
  }, [initialArifpayEndpoints, searchTerm, sortConfig]);

  const paginatedEndpoints = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedEndpoints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedEndpoints, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ArifPay Endpoints</CardTitle>
        <CardDescription>A list of all configured ArifPay endpoints.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('BANK')} className="px-2">Bank{getSortIndicator('BANK')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('DISPLAYNAME')} className="px-2">Display Name{getSortIndicator('DISPLAYNAME')}</Button></TableHead>
                <TableHead>Two Step</TableHead>
                <TableHead>OTP</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('TRANSACTIONTYPE')} className="px-2">Transaction Type{getSortIndicator('TRANSACTIONTYPE')}</Button></TableHead>
                <TableHead>Beneficiary Account</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('ORDER')} className="px-2">Order{getSortIndicator('ORDER')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEndpoints.length > 0 ? (
                paginatedEndpoints.map((endpoint) => (
                  <TableRow key={endpoint.ID}>
                    <TableCell className="font-medium">{endpoint.BANK}</TableCell>
                    <TableCell>{endpoint.DISPLAYNAME}</TableCell>
                    <TableCell><Badge variant={endpoint.ISTWOSTEP ? 'default' : 'secondary'}>{endpoint.ISTWOSTEP ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell><Badge variant={endpoint.ISOTP ? 'default' : 'secondary'}>{endpoint.ISOTP ? 'Yes' : 'No'}</Badge></TableCell>
                    <TableCell>{endpoint.TRANSACTIONTYPE}</TableCell>
                    <TableCell>{endpoint.BENEFICIARYACCOUNT}</TableCell>
                    <TableCell>{endpoint.ORDER}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">No endpoints found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{paginatedEndpoints.length}</strong> of <strong>{filteredAndSortedEndpoints.length}</strong> endpoints
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
            disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedEndpoints.length}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
