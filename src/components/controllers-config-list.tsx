
'use client';

import * as React from 'react';
import type { controllersconfigs } from '@/types';
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
import { useDataContext } from '@/context/data-context';
import { EditControllersConfigForm } from './edit-controllers-config-form';

type SortableKeys = 'CONTROLLERKEY' | 'APIKEY';
const ITEMS_PER_PAGE = 15;

export default function ControllersConfigList({ controllersConfigs: initialControllersConfigs }: { controllersConfigs: controllersconfigs[] }) {
  const { controllersConfigs, updateControllersConfig } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'CONTROLLERKEY', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedConfig, setSelectedConfig] = React.useState<controllersconfigs | null>(null);

  const handleEdit = (config: controllersconfigs) => {
    setSelectedConfig(config);
    setIsEditDialogOpen(true);
  };

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedConfigs = React.useMemo(() => {
    let sortableItems = [...controllersConfigs];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((config) => {
        if (searchField === 'all') {
          return Object.values(config).some(val => String(val).toLowerCase().includes(lowercasedTerm));
        }
        const fieldValue = config[searchField as keyof controllersconfigs] as string;
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
  }, [controllersConfigs, searchTerm, searchField, sortConfig]);

  const paginatedConfigs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedConfigs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedConfigs, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Controller Configurations</CardTitle>
          <CardDescription>A list of all controller configurations.</CardDescription>
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
                      <SelectItem value="CONTROLLERKEY">Controller Key</SelectItem>
                      <SelectItem value="APIKEY">API Key</SelectItem>
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
                  <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('CONTROLLERKEY')} className="px-2">Controller Key{getSortIndicator('CONTROLLERKEY')}</Button></TableHead>
                  <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('APIKEY')} className="px-2">API Key{getSortIndicator('APIKEY')}</Button></TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedConfigs.length > 0 ? (
                  paginatedConfigs.map((config) => (
                    <TableRow key={config.ID}>
                      <TableCell className="font-medium">{config.CONTROLLERKEY}</TableCell>
                      <TableCell>{config.APIKEY}</TableCell>
                       <TableCell>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                      <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(config)}>
                                      <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">No configurations found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{paginatedConfigs.length}</strong> of <strong>{filteredAndSortedConfigs.length}</strong> configurations
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
              disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedConfigs.length}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Controller Configuration</DialogTitle>
            </DialogHeader>
            {selectedConfig && (
                <EditControllersConfigForm
                    config={selectedConfig}
                    setOpen={setIsEditDialogOpen}
                />
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
