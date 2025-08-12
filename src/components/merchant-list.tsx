

'use client';

import * as React from 'react';
import type { Merchant, EditableItem } from '@/types';
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditMerchantForm } from './edit-merchant-form';
import { useDataContext } from '@/context/data-context';

type SortableKeys = 'name' | 'company' | 'email' | 'status' | 'role';
const ITEMS_PER_PAGE = 15;

export default function MerchantList({ merchants: initialMerchants, approvalView = false }: { merchants: Merchant[], approvalView?: boolean }) {
  const { merchants: contextMerchants, updateMerchantStatus } = useDataContext();
  const [merchants, setMerchants] = React.useState(initialMerchants);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'name', direction: 'ascending' });
  const [isEditMerchantOpen, setIsEditMerchantOpen] = React.useState(false);
  const [selectedMerchant, setSelectedMerchant] = React.useState<EditableItem>(null);
  const [activeTab, setActiveTab] = React.useState(approvalView ? 'pending' : 'all');
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setMerchants(initialMerchants);
  }, [initialMerchants]);
  
  const handleStatusChange = (merchantId: string, status: 'Active' | 'Disabled') => {
    updateMerchantStatus(merchantId, status);
  };
  
  const handleEdit = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setIsEditMerchantOpen(true);
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

  const filteredAndSortedMerchants = React.useMemo(() => {
    let sourceData = approvalView ? contextMerchants : merchants;
    let sortableItems = [...sourceData];

    if (approvalView) {
      sortableItems = sortableItems.filter(m => m.status === 'Pending');
    }
    else if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (merchant) => merchant.status.toLowerCase() === activeTab
      );
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((merchant) =>
        Object.values(merchant).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(lowercasedTerm)
        )
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        // Always put Admin first
        if (a.role === 'Admin' && b.role !== 'Admin') return -1;
        if (a.role !== 'Admin' && b.role === 'Admin') return 1;

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
        // Default sort: Admin first
        sortableItems.sort((a, b) => {
            if (a.role === 'Admin' && b.role !== 'Admin') return -1;
            if (a.role !== 'Admin' && b.role === 'Admin') return 1;
            return 0;
        });
    }

    return sortableItems;
  }, [merchants, contextMerchants, searchTerm, sortConfig, activeTab, approvalView]);
  
  const paginatedMerchants = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedMerchants.slice(startIndex, endIndex);
  }, [filteredAndSortedMerchants, currentPage]);

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
  
  const getStatusVariant = (status: Merchant['status']) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Disabled':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
          {!approvalView && (
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="disabled">Disabled</TabsTrigger>
            </TabsList>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </div>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>{approvalView ? 'Merchant User Approvals' : 'Merchant Users'}</CardTitle>
              <CardDescription>
                {approvalView ? 'Review and approve pending merchant users.' : 'Manage all merchant admins and sales representatives.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('name')} className="px-2">
                          User Name
                          {getSortIndicator('name')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('company')} className="px-2">
                          Company
                          {getSortIndicator('company')}
                        </Button>
                      </TableHead>
                       <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('role')} className="px-2">
                          Role
                          {getSortIndicator('role')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('email')} className="px-2">
                          Email
                          {getSortIndicator('email')}
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
                    {paginatedMerchants.length > 0 ? (
                      paginatedMerchants.map((merchant) => (
                        <TableRow key={merchant.id}>
                          <TableCell className="font-medium">{merchant.name}</TableCell>
                          <TableCell>{merchant.company}</TableCell>
                          <TableCell>
                             <Badge variant={merchant.role === 'Admin' ? 'default' : 'secondary'}>{merchant.role}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{merchant.email}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(merchant.status)}>{merchant.status}</Badge>
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
                                {!approvalView && <DropdownMenuItem onClick={() => handleEdit(merchant)}>Edit</DropdownMenuItem>}
                                {approvalView && merchant.status === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleStatusChange(merchant.id, 'Active')}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(merchant.id, 'Disabled')}>
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
                          No users found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{paginatedMerchants.length}</strong> of <strong>{filteredAndSortedMerchants.length}</strong> users
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
                        disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedMerchants.length}
                    >
                        Next
                    </Button>
                </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    <Dialog open={isEditMerchantOpen} onOpenChange={setIsEditMerchantOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Merchant User</DialogTitle>
            </DialogHeader>
            {selectedMerchant && selectedMerchant.hasOwnProperty('role') && (
                <EditMerchantForm
                    merchant={selectedMerchant as Merchant}
                    setOpen={setIsEditMerchantOpen}
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
