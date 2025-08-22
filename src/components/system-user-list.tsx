
'use client';

import * as React from 'react';
import type { SystemUser, EditableItem } from '@/types';
import { ArrowUpDown, PlusCircle, MoreHorizontal, CheckCircle, XCircle, Edit } from 'lucide-react';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDataContext } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { AddSystemUserForm } from './add-branch-user-form';
import { EditSystemUserForm } from './edit-system-user-form';

type SortableKeys = 'name' | 'email' | 'status' | 'role';
const ITEMS_PER_PAGE = 15;

export default function SystemUserList({ systemUsers: initialUsers }: { systemUsers: SystemUser[] }) {
  const { systemUsers, updateSystemUserStatus } = useDataContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'name', direction: 'ascending' });
  const [isAddUserOpen, setIsAddUserOpen] = React.useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<EditableItem>(null);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleApproval = async (userId: string, isApproved: boolean) => {
    try {
        await updateSystemUserStatus(userId, isApproved ? 'Active' : 'Inactive');
        toast({
            title: 'User Status Updated',
            description: `The user has been ${isApproved ? 'activated' : 'deactivated'}.`,
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update the user status.',
        });
    }
  };

  const handleEdit = (user: SystemUser) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = React.useMemo(() => {
    let sortableItems = [...systemUsers];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((user) =>
        Object.values(user).some(val =>
          String(val).toLowerCase().includes(lowercasedTerm) ||
          (user.role && user.role.ROLENAME.toLowerCase().includes(lowercasedTerm))
        )
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = sortConfig.key === 'role' ? a.role?.ROLENAME : a[sortConfig.key];
        const valB = sortConfig.key === 'role' ? b.role?.ROLENAME : b[sortConfig.key];

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [systemUsers, searchTerm, sortConfig]);

  const paginatedUsers = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedUsers, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="default">Active</Badge>;
      case 'Pending': return <Badge variant="secondary">Pending</Badge>;
      case 'Inactive': return <Badge variant="destructive">Inactive</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>A list of all system users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-2 py-4">
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add User</span>
                </Button>
              </DialogTrigger>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('name')} className="px-2">Name{getSortIndicator('name')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('email')} className="px-2">Email{getSortIndicator('email')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('role')} className="px-2">Role{getSortIndicator('role')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('status')} className="px-2">Status{getSortIndicator('status')}</Button></TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role ? user.role.ROLENAME : 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(user)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              {user.status === 'Pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => handleApproval(user.id, true)}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleApproval(user.id, false)}>
                                    <XCircle className="mr-2 h-4 w-4" /> Deactivate
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
                      <TableCell colSpan={5} className="h-24 text-center">No users found.</TableCell>
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
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedUsers.length}>Next</Button>
            </div>
          </CardFooter>
        </Card>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New System User</DialogTitle>
          </DialogHeader>
          <AddSystemUserForm setOpen={setIsAddUserOpen} />
        </DialogContent>
      </Dialog>
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit System User</DialogTitle>
          </DialogHeader>
          {selectedUser && <EditSystemUserForm user={selectedUser as SystemUser} setOpen={setIsEditUserOpen} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
