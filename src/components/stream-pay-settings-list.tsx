
'use client';

import * as React from 'react';
import type { stream_pay_settings } from '@/types';
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

type SortableKeys = 'ADDRESS' | 'USERNAME' | 'INSERTDATE' | 'UPDATEDATE';
const ITEMS_PER_PAGE = 15;

export default function StreamPaySettingsList({ streamPaySettings: initialSettings }: { streamPaySettings: stream_pay_settings[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'INSERTDATE', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedSettings = React.useMemo(() => {
    let sortableItems = [...initialSettings];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((setting) =>
        Object.values(setting).some(val => String(val).toLowerCase().includes(lowercasedTerm))
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
  }, [initialSettings, searchTerm, sortConfig]);

  const paginatedSettings = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedSettings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedSettings, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>StreamPay Settings</CardTitle>
        <CardDescription>A list of all StreamPay settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('ADDRESS')} className="px-2">ADDRESS{getSortIndicator('ADDRESS')}</Button></TableHead>
                <TableHead>IV</TableHead>
                <TableHead>KEY</TableHead>
                <TableHead>HV</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('USERNAME')} className="px-2">USERNAME{getSortIndicator('USERNAME')}</Button></TableHead>
                <TableHead>PASSWORD</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('INSERTDATE')} className="px-2">INSERTDATE{getSortIndicator('INSERTDATE')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('UPDATEDATE')} className="px-2">UPDATEDATE{getSortIndicator('UPDATEDATE')}</Button></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSettings.length > 0 ? (
                paginatedSettings.map((setting) => (
                  <TableRow key={setting.ID}>
                    <TableCell className="font-medium">{setting.ADDRESS}</TableCell>
                    <TableCell>{'●'.repeat(setting.IV.length)}</TableCell>
                    <TableCell>{'●'.repeat(setting.KEY.length)}</TableCell>
                    <TableCell>{setting.HV}</TableCell>
                    <TableCell>{setting.USERNAME}</TableCell>
                    <TableCell>{'●'.repeat(setting.PASSWORD.length)}</TableCell>
                    <TableCell>{new Date(setting.INSERTDATE).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(setting.UPDATEDATE).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">No settings found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{paginatedSettings.length}</strong> of <strong>{filteredAndSortedSettings.length}</strong> settings
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
            disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedSettings.length}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
