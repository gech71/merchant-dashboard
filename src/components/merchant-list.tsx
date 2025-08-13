
'use client';

import * as React from 'react';
import type { Merchant_users, EditableItem, allowed_companies } from '@/types';
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
import { useDataContext } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';

type SortableKeys = 'FULLNAME' | 'ACCOUNTNUMBER' | 'STATUS' | 'ROLE';
const ITEMS_PER_PAGE = 15;

export default function MerchantList({ merchants: initialMerchants, approvalView = false }: { merchants: Merchant_users[], approvalView?: boolean }) {
  const { merchants: contextMerchants, updateMerchantStatus, allowedCompanies } = useDataContext();
  const { toast } = useToast();
  const [merchants, setMerchants] = React.useState(initialMerchants);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'FULLNAME', direction: 'ascending' });
  const [activeTab, setActiveTab] = React.useState(approvalView ? 'pending' : 'all');
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setMerchants(initialMerchants);
  }, [initialMerchants]);
  
  const handleStatusChange = async (merchantId: string, status: 'Active' | 'Disabled') => {
    try {
      await updateMerchantStatus(merchantId, status);
      toast({
        title: 'Merchant Status Updated',
        description: `The merchant has been ${status === 'Active' ? 'approved' : 'rejected'}.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the merchant status.',
      });
    }
  };

  const getCompanyName = (accountNumber: string) => {
    const company = allowedCompanies.find(c => c.ACCOUNTNUMBER === accountNumber);
    return company ? company.FIELDNAME : 'N/A';
  }

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
      sortableItems = sortableItems.filter(m => m.STATUS === 'Pending');
    }
    else if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (merchant) => merchant.STATUS.toLowerCase() === activeTab
      );
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((merchant) =>
        Object.values(merchant).some(
          (value) =>
            typeof value === 'string' &&
            value.toLowerCase().includes(lowercasedTerm)
        ) || getCompanyName(merchant.ACCOUNTNUMBER).toLowerCase().includes(lowercasedTerm)
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const roleA = a.role?.name || '';
        const roleB = b.role?.name || '';
        if (roleA === 'Admin' && roleB !== 'Admin') return -1;
        if (roleA !== 'Admin' && roleB === 'Admin') return 1;
        
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';

        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    } else {
        // Default sort: Admin first
        sortableItems.sort((a, b) => {
            if (a.role?.name === 'Admin' && b.role?.name !== 'Admin') return -1;
            if (a.role?.name !== 'Admin' && b.role?.name === 'Admin') return 1;
            return 0;
        });
    }

    return sortableItems;
  }, [merchants, contextMerchants, searchTerm, sortConfig, activeTab, approvalView, allowedCompanies]);
  
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
  
  const getStatusVariant = (status: Merchant_users['STATUS']) => {
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
                        <Button variant="ghost" onClick={() => requestSort('FULLNAME')} className="px-2">
                          User Name
                          {getSortIndicator('FULLNAME')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        Company
                      </TableHead>
                       <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('ROLE')} className="px-2">
                          Role
                          {getSortIndicator('ROLE')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        PHONENUMBER
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('STATUS')} className="px-2">
                          Status
                          {getSortIndicator('STATUS')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMerchants.length > 0 ? (
                      paginatedMerchants.map((merchantUser) => (
                        <TableRow key={merchantUser.ID}>
                          <TableCell className="font-medium">{merchantUser.FULLNAME}</TableCell>
                          <TableCell>{getCompanyName(merchantUser.ACCOUNTNUMBER)}</TableCell>
                          <TableCell>
                             <Badge variant={merchantUser.role?.name === 'Admin' ? 'default' : 'secondary'}>{merchantUser.role?.name || 'Unassigned'}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{merchantUser.PHONENUMBER}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(merchantUser.STATUS)}>{merchantUser.STATUS}</Badge>
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
                                {approvalView && merchantUser.STATUS === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleStatusChange(merchantUser.ID, 'Active')}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(merchantUser.ID, 'Disabled')}>
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
    </>
  );
}
