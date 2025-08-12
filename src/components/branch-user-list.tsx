
'use client';

import * as React from 'react';
import type { BranchUser, EditableItem } from '@/types';
import { ArrowUpDown, UserPlus, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddBranchUserForm } from './add-branch-user-form';
import { EditBranchUserForm } from './edit-branch-user-form';
import { useDataContext } from '@/context/data-context';

type SortableKeys = 'name' | 'email' | 'branch' | 'status';
const ITEMS_PER_PAGE = 15;

export default function BranchUserList({ branchUsers: initialBranchUsers, approvalView = false }: { branchUsers: BranchUser[], approvalView?: boolean }) {
  const { branchUsers, updateBranchUserStatus } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'name', direction: 'ascending' });
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<EditableItem>(null);
  const [activeTab, setActiveTab] = React.useState(approvalView ? 'pending' : 'all');
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleStatusChange = (userId: string, status: 'Active' | 'Inactive') => {
    updateBranchUserStatus(userId, status);
  };
  
  const handleEdit = (user: BranchUser) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
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

  const filteredAndSortedUsers = React.useMemo(() => {
    let sortableItems = [...branchUsers];

    if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (user) => user.status.toLowerCase() === activeTab
      );
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((user) =>
        Object.values(user).some(
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
  }, [branchUsers, searchTerm, sortConfig, activeTab]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage]);

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
  
  const getStatusVariant = (status: BranchUser['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Inactive':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <>
    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          {!approvalView && (
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Input
              placeholder="Search branch users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {!approvalView && (
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Branch User
                  </span>
                </Button>
              </DialogTrigger>
            )}
          </div>
        </div>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>{approvalView ? 'Branch User Approvals' : 'Branch Users'}</CardTitle>
              <CardDescription>
                {approvalView ? 'Review and approve pending branch users.' : 'Manage all registered branch users.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('name')} className="px-2">
                          Name
                          {getSortIndicator('name')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('email')} className="px-2">
                          Email
                          {getSortIndicator('email')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('branch')} className="px-2">
                          Branch
                          {getSortIndicator('branch')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('status')} className="px-2">
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
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                          <TableCell>{user.branch}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
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
                                {!approvalView && <DropdownMenuItem onClick={() => handleEdit(user)}>Edit</DropdownMenuItem>}
                                {approvalView && user.status === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Active')}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'Inactive')}>
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
                        <TableCell colSpan={5} className="h-24 text-center">
                          No branch users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{paginatedUsers.length}</strong> of <strong>{filteredAndSortedUsers.length}</strong> users
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
                        disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedUsers.length}
                    >
                        Next
                    </Button>
                </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Branch User</DialogTitle>
        </DialogHeader>
        <AddBranchUserForm setOpen={setIsAddUserOpen} />
      </DialogContent>
    </Dialog>
    <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Branch User</DialogTitle>
            </DialogHeader>
            {selectedUser && selectedUser.hasOwnProperty('branch') && (
                <EditBranchUserForm
                    user={selectedUser as BranchUser}
                    setOpen={setIsEditUserOpen}
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
