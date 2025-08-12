
'use client';

import * as React from 'react';
import type { role_capablities } from '@/types';
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

type SortableKeys = 'ROLEID' | 'MENUNAME' | 'PARENT' | 'MENUORDER' | 'SUBMENUORDER';
const ITEMS_PER_PAGE = 15;

export default function RoleCapabilityList({ roleCapabilities: initialCapabilities }: { roleCapabilities: role_capablities[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'MENUORDER', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedItems = React.useMemo(() => {
    let sortableItems = [...initialCapabilities];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((item) =>
        Object.values(item).some(val => String(val).toLowerCase().includes(lowercasedTerm))
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        // Secondary sort by sub-order if primary is the same
        if (sortConfig.key === 'MENUORDER' && a.SUBMENUORDER < b.SUBMENUORDER) return -1;
        if (sortConfig.key === 'MENUORDER' && a.SUBMENUORDER > b.SUBMENUORDER) return 1;
        return 0;
      });
    }

    return sortableItems;
  }, [initialCapabilities, searchTerm, sortConfig]);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Capabilities</CardTitle>
        <CardDescription>A list of all role-based capabilities for sidebar navigation.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search capabilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('ROLEID')} className="px-2">ROLEID{getSortIndicator('ROLEID')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('MENUNAME')} className="px-2">MENUNAME{getSortIndicator('MENUNAME')}</Button></TableHead>
                <TableHead>MENUNAME_am</TableHead>
                <TableHead>ADDRESS</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('PARENT')} className="px-2">PARENT{getSortIndicator('PARENT')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('MENUORDER')} className="px-2">ORDER{getSortIndicator('MENUORDER')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <TableRow key={item.ID}>
                    <TableCell className="font-medium">{item.ROLEID}</TableCell>
                    <TableCell>{item.MENUNAME}</TableCell>
                    <TableCell>{item.MENUNAME_am}</TableCell>
                    <TableCell>{item.ADDRESS}</TableCell>
                    <TableCell>{item.PARENT}</TableCell>
                    <TableCell>{item.MENUORDER}.{item.SUBMENUORDER}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No capabilities found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{paginatedItems.length}</strong> of <strong>{filteredAndSortedItems.length}</strong> capabilities
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
            disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedItems.length}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
