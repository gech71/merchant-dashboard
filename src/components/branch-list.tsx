
'use client';

import * as React from 'react';
import type { Branch, EditableItem } from '@/types';
import { ArrowUpDown, PlusCircle, MoreHorizontal } from 'lucide-react';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddBranchForm } from './add-branch-form';
import { EditBranchForm } from './edit-branch-form';
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/context/data-context';

type SortableKeys = 'name' | 'code' | 'address' | 'contact' | 'status';
const ITEMS_PER_PAGE = 15;

export default function BranchList({ branches: initialBranches }: { branches: Branch[], approvalView?: boolean }) {
  const { updateBranchStatus } = useDataContext();
  const [branches, setBranches] = React.useState(initialBranches);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'name', direction: 'ascending' });
  const [isAddBranchOpen, setIsAddBranchOpen] = React.useState(false);
  const [isEditBranchOpen, setIsEditBranchOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<EditableItem>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  React.useEffect(() => {
    setBranches(initialBranches);
  }, [initialBranches]);

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsEditBranchOpen(true);
  };

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

  const filteredAndSortedBranches = React.useMemo(() => {
    let sortableItems = [...branches];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((branch) =>
        Object.values(branch).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [branches, searchTerm, sortConfig]);
  
  const paginatedBranches = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedBranches.slice(startIndex, endIndex);
  }, [filteredAndSortedBranches, currentPage]);

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

  const getStatusVariant = (status: Branch['status']) => {
    switch (status) {
      case 'Approved':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
    <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
      <Card>
        <CardHeader>
          <CardTitle>Branches</CardTitle>
          <CardDescription>
            A list of all registered bank branches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 py-4">
            <Input
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Branch
                </span>
              </Button>
            </DialogTrigger>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('name')}
                      className="px-2"
                    >
                      Branch Name
                      {getSortIndicator('name')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('code')}
                      className="px-2"
                    >
                      Branch Code
                      {getSortIndicator('code')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('address')}
                      className="px-2"
                    >
                      Address
                      {getSortIndicator('address')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('contact')}
                      className="px-2"
                    >
                      Contact
                      {getSortIndicator('contact')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort('status')}
                      className="px-2"
                    >
                      Status
                      {getSortIndicator('status')}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBranches.length > 0 ? (
                  paginatedBranches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">{branch.name}</TableCell>
                      <TableCell>{branch.code}</TableCell>
                      <TableCell className="hidden md:table-cell">{branch.address}</TableCell>
                      <TableCell>{branch.contact}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(branch.status)}>{branch.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(branch)}>Edit</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No branches found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>{paginatedBranches.length}</strong> of <strong>{filteredAndSortedBranches.length}</strong> branches
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
                    disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedBranches.length}
                >
                    Next
                </Button>
            </div>
        </CardFooter>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
        </DialogHeader>
        <AddBranchForm setOpen={setIsAddBranchOpen} />
      </DialogContent>
    </Dialog>
    <Dialog open={isEditBranchOpen} onOpenChange={setIsEditBranchOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Branch</DialogTitle>
            </DialogHeader>
            {selectedBranch && selectedBranch.hasOwnProperty('code') && (
                <EditBranchForm 
                    branch={selectedBranch as Branch} 
                    setOpen={setIsEditBranchOpen} 
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
