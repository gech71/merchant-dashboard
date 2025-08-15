
'use client';

import * as React from 'react';
import type { ussd_push_settings } from '@/types';
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

type SortableKeys = 'ADDRESS' | 'USERNAME';
const ITEMS_PER_PAGE = 15;

export default function UssdPushSettingsList({ ussdPushSettings: initialSettings }: { ussdPushSettings: ussd_push_settings[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'ADDRESS', direction: 'ascending' });
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
      sortableItems = sortableItems.filter((setting) => {
        if (searchField === 'all') {
            return Object.values(setting).some(val => String(val).toLowerCase().includes(lowercasedTerm))
        }
        const fieldValue = setting[searchField as keyof ussd_push_settings] as string;
        return fieldValue?.toLowerCase().includes(lowercasedTerm)
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
  }, [initialSettings, searchTerm, searchField, sortConfig]);

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
        <CardTitle>USSD Push Settings</CardTitle>
        <CardDescription>A list of all USSD Push settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
          <div className="flex items-center gap-2">
            <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="ADDRESS">Address</SelectItem>
                <SelectItem value="RESULTURL">Result URL</SelectItem>
                <SelectItem value="USERNAME">Username</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search settings..."
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
                <TableHead><Button variant="ghost" onClick={() => requestSort('ADDRESS')} className="px-2">Address{getSortIndicator('ADDRESS')}</Button></TableHead>
                <TableHead>Result URL</TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('USERNAME')} className="px-2">Username{getSortIndicator('USERNAME')}</Button></TableHead>
                <TableHead>Password</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSettings.length > 0 ? (
                paginatedSettings.map((setting) => (
                  <TableRow key={setting.ID}>
                    <TableCell className="font-medium">{setting.ADDRESS}</TableCell>
                    <TableCell>{setting.RESULTURL}</TableCell>
                    <TableCell>{setting.USERNAME}</TableCell>
                    <TableCell>{'●'.repeat(setting.PASSWORD.length)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No settings found.</TableCell>
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
