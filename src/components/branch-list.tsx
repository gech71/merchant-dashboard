
'use client';

import * as React from 'react';
import type { Branch } from '@/types';
import { ArrowUpDown, PlusCircle, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddBranchForm } from './add-branch-form';
import { Badge } from '@/components/ui/badge';

type SortableKeys = 'name' | 'code' | 'address' | 'contact' | 'status';

export default function BranchList({ branches: initialBranches, approvalView = false }: { branches: Branch[], approvalView?: boolean }) {
  const [branches, setBranches] = React.useState(initialBranches);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'name', direction: 'ascending' });
  const [isAddBranchOpen, setIsAddBranchOpen] = React.useState(false);

  const handleStatusChange = (branchId: string, status: 'Approved' | 'Rejected') => {
    setBranches(branches.map(b => b.id === branchId ? { ...b, status } : b).filter(b => {
        if (!approvalView) return true;
        return b.status === 'Pending';
    }));
  };

  const handleAddBranch = (newBranch: Branch) => {
    setBranches(prev => [...prev, newBranch]);
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
    <Dialog open={isAddBranchOpen} onOpenChange={setIsAddBranchOpen}>
      <Card>
        <CardHeader>
          <CardTitle>{approvalView ? 'Branch Approvals' : 'Branches'}</CardTitle>
          <CardDescription>
            {approvalView ? 'Review and approve pending branches.' : 'A list of all registered bank branches.'}
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
            {!approvalView && (
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Branch
                  </span>
                </Button>
              </DialogTrigger>
            )}
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
                {filteredAndSortedBranches.length > 0 ? (
                  filteredAndSortedBranches.map((branch) => (
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            {branch.status === 'Pending' && (
                              <>
                                <DropdownMenuItem onClick={() => handleStatusChange(branch.id, 'Approved')}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(branch.id, 'Rejected')}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
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
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Branch</DialogTitle>
        </DialogHeader>
        <AddBranchForm setOpen={setIsAddBranchOpen} onAddBranch={handleAddBranch} />
      </DialogContent>
    </Dialog>
  );
}
