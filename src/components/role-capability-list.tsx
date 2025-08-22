
'use client';

import * as React from 'react';
import type { role_capablities } from '@/types';
import { ArrowUpDown, Edit, MoreHorizontal, Trash2, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { Badge } from './ui/badge';
import { useDataContext } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { EditRoleCapabilityForm } from './edit-role-capability-form';
import { AddRoleCapabilityForm } from './add-role-capability-form';

type SortableKeys = 'roleName' | 'MENUNAME' | 'PARENT' | 'MENUORDER' | 'SUBMENUORDER';
const ITEMS_PER_PAGE = 15;

export default function RoleCapabilityList({ roleCapabilities: initialCapabilities }: { roleCapabilities: role_capablities[] }) {
  const { roles, roleCapabilities, deleteRoleCapability } = useDataContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'MENUORDER', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedCapability, setSelectedCapability] = React.useState<role_capablities | null>(null);

  const getRoleName = React.useCallback((roleId: string) => {
    const role = roles.find(r => r.ID === roleId);
    return role ? role.ROLENAME : roleId;
  }, [roles]);

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleEdit = (capability: role_capablities) => {
    setSelectedCapability(capability);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteRoleCapability(id);
      toast({
        title: 'Success',
        description: 'Role capability deleted successfully.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete role capability.',
      });
    }
  };


  const filteredAndSortedItems = React.useMemo(() => {
    let sortableItems = [...roleCapabilities].map(item => ({
        ...item,
        roleName: getRoleName(item.ROLEID)
    }));

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
        
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        if (sortConfig.key === 'PARENT') {
          const boolA = valA ?? false;
          const boolB = valB ?? false;
          if (boolA < boolB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (boolA > boolB) return sortConfig.direction === 'ascending' ? 1 : -1;
        } else {
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        
        // Secondary sort by sub-order if primary is the same
        if (sortConfig.key === 'MENUORDER' && (a.SUBMENUORDER ?? 0) < (b.SUBMENUORDER ?? 0)) return -1;
        if (sortConfig.key === 'MENUORDER' && (a.SUBMENUORDER ?? 0) > (b.SUBMENUORDER ?? 0)) return 1;
        return 0;
      });
    }

    return sortableItems;
  }, [roleCapabilities, searchTerm, sortConfig, getRoleName]);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedItems, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                  <div>
                      <CardTitle>Role Capabilities</CardTitle>
                      <CardDescription>A list of all role-based capabilities for sidebar navigation.</CardDescription>
                  </div>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-9 gap-1">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add New Capability</span>
                    </Button>
                  </DialogTrigger>
              </div>
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
                    <TableHead><Button variant="ghost" onClick={() => requestSort('roleName')} className="px-2">Role Name{getSortIndicator('roleName')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('MENUNAME')} className="px-2">Menu Name{getSortIndicator('MENUNAME')}</Button></TableHead>
                    <TableHead>Menu Name (Amharic)</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('PARENT')} className="px-2">Parent{getSortIndicator('PARENT')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('MENUORDER')} className="px-2">Menu Order{getSortIndicator('MENUORDER')}</Button></TableHead>
                    <TableHead><Button variant="ghost" onClick={() => requestSort('SUBMENUORDER')} className="px-2">Sub-Menu Order{getSortIndicator('SUBMENUORDER')}</Button></TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item) => (
                      <TableRow key={item.ID}>
                        <TableCell className="font-medium">{item.roleName}</TableCell>
                        <TableCell>{item.MENUNAME}</TableCell>
                        <TableCell>{item.MENUNAME_am}</TableCell>
                        <TableCell>{item.ADDRESS}</TableCell>
                        <TableCell>
                          <Badge variant={item.PARENT ? 'default' : 'secondary'}>
                            {item.PARENT ? 'Yes' : 'No'}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.MENUORDER}</TableCell>
                        <TableCell>{item.SUBMENUORDER ?? 'N/A'}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(item)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="w-full text-left relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 focus:bg-red-50 focus:text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this capability.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(item.ID)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">No capabilities found.</TableCell>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Role Capability</DialogTitle>
          </DialogHeader>
          <AddRoleCapabilityForm setOpen={setIsAddDialogOpen} />
        </DialogContent>
      </Dialog>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Role Capability</DialogTitle>
          </DialogHeader>
          {selectedCapability && <EditRoleCapabilityForm capability={selectedCapability} setOpen={setIsEditDialogOpen} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
