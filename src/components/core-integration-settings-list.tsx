
'use client';

import * as React from 'react';
import type { core_integration_settings } from '@/types';
import { ArrowUpDown, Edit, MoreHorizontal } from 'lucide-react';

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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { EditCoreIntegrationSettingForm } from './edit-core-integration-setting-form';
import { useDataContext } from '@/context/data-context';

type SortableKeys = 'UNIQUEKEY' | 'ADDRESS' | 'USERNAME';
const ITEMS_PER_PAGE = 15;

export default function CoreIntegrationSettingsList({ coreIntegrationSettings: initialSettings }: { coreIntegrationSettings: core_integration_settings[] }) {
  const { coreIntegrationSettings } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'UNIQUEKEY', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedSetting, setSelectedSetting] = React.useState<core_integration_settings | null>(null);

  const handleEdit = (setting: core_integration_settings) => {
    setSelectedSetting(setting);
    setIsEditDialogOpen(true);
  };

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedSettings = React.useMemo(() => {
    let sortableItems = [...coreIntegrationSettings];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((setting) => {
        if (searchField === 'all') {
            return Object.values(setting).some(val => String(val).toLowerCase().includes(lowercasedTerm))
        }
        const fieldValue = setting[searchField as keyof core_integration_settings] as string;
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
  }, [coreIntegrationSettings, searchTerm, searchField, sortConfig]);

  const paginatedSettings = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedSettings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedSettings, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Core Integration Settings</CardTitle>
          <CardDescription>A list of all core integration settings.</CardDescription>
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
                      <SelectItem value="UNIQUEKEY">Unique Key</SelectItem>
                      <SelectItem value="ADDRESS">Address</SelectItem>
                      <SelectItem value="USERNAME">Username</SelectItem>
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
                  <TableHead><Button variant="ghost" onClick={() => requestSort('UNIQUEKEY')} className="px-2">Unique Key{getSortIndicator('UNIQUEKEY')}</Button></TableHead>
                  <TableHead><Button variant="ghost" onClick={() => requestSort('ADDRESS')} className="px-2">Address{getSortIndicator('ADDRESS')}</Button></TableHead>
                  <TableHead><Button variant="ghost" onClick={() => requestSort('USERNAME')} className="px-2">Username{getSortIndicator('USERNAME')}</Button></TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSettings.length > 0 ? (
                  paginatedSettings.map((setting) => (
                    <TableRow key={setting.ID}>
                      <TableCell className="font-medium">{setting.UNIQUEKEY}</TableCell>
                      <TableCell>{setting.ADDRESS}</TableCell>
                      <TableCell>{setting.USERNAME}</TableCell>
                      <TableCell>{'●'.repeat(setting.PASSWORD.length)}</TableCell>
                      <TableCell>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(setting)}>
                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">No settings found.</TableCell>
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
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Core Integration Setting</DialogTitle>
            </DialogHeader>
            {selectedSetting && (
                <EditCoreIntegrationSettingForm
                    setting={selectedSetting}
                    setOpen={setIsEditDialogOpen}
                />
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
