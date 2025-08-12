
'use client';

import * as React from 'react';
import type { allowed_companies, EditableItem } from '@/types';
import { ArrowUpDown, PlusCircle, MoreHorizontal, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddAllowedCompanyForm } from '@/components/add-allowed-company-form';
import { EditAllowedCompanyForm } from '@/components/edit-allowed-company-form';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDataContext } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortableKeys = 'FIELDNAME' | 'ACCOUNTNUMBER' | 'STATUS' | 'APPROVEUSER' | 'APPROVED';
const ITEMS_PER_PAGE = 15;

export default function AllowedCompanyList({ allowedCompanies: initialCompanies, approvalView = false }: { allowedCompanies: allowed_companies[], approvalView?: boolean }) {
  const { updateAllowedCompanyApproval, currentUser, branches, merchants, branchUsers } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'FIELDNAME', direction: 'ascending' });
  const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<EditableItem>(null);
  const [activeTab, setActiveTab] = React.useState(approvalView ? 'pending' : 'all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [branchFilter, setBranchFilter] = React.useState('all');

  const handleApproval = (companyId: string, isApproved: boolean) => {
    updateAllowedCompanyApproval(companyId, isApproved);
  };
  
  const handleEdit = (company: allowed_companies) => {
    setSelectedCompany(company);
    setIsEditCompanyOpen(true);
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

  const filteredAndSortedCompanies = React.useMemo(() => {
    let sortableItems = [...initialCompanies];
  
    if (branchFilter !== 'all') {
      const usersInBranch = branchUsers.filter(bu => bu.branch === branchFilter);
      const accountsInBranch = new Set(merchants.filter(m => usersInBranch.some(u => u.email === m.PHONENUMBER)).map(m => m.ACCOUNTNUMBER));
      sortableItems = sortableItems.filter(c => accountsInBranch.has(c.ACCOUNTNUMBER));
    }


    if (approvalView) {
      sortableItems = sortableItems.filter(c => c.STATUS === 'Pending');
    }
    else if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (company) => company.STATUS.toLowerCase() === activeTab
      );
    }
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((company) =>
        Object.values(company).some(val => String(val).toLowerCase().includes(lowercasedTerm))
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key] ?? '';
        const valB = b[sortConfig.key] ?? '';
        if (typeof valA === 'boolean' && typeof valB === 'boolean') {
          return sortConfig.direction === 'ascending' ? (valA === valB ? 0 : valA ? -1 : 1) : (valA === valB ? 0 : valA ? 1 : -1)
        }
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [initialCompanies, searchTerm, sortConfig, activeTab, approvalView, branchFilter, merchants, branchUsers]);
  
  const paginatedCompanies = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedCompanies.slice(startIndex, endIndex);
  }, [filteredAndSortedCompanies, currentPage]);

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
  
  const getStatusVariant = (status: allowed_companies['STATUS']) => {
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
    <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
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
            {!approvalView && (
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                    <SelectTrigger className="h-8 w-[150px] lg:w-[200px]">
                        <SelectValue placeholder="Filter by branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            {!approvalView && (
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Company
                  </span>
                </Button>
              </DialogTrigger>
            )}
          </div>
        </div>
        <TabsContent value={approvalView ? 'pending' : activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>{approvalView ? 'Allowed Company Approvals' : 'Allowed Companies'}</CardTitle>
              <CardDescription>
                {approvalView ? `Review and approve pending companies.` : 'A list of all allowed companies.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('FIELDNAME')}
                          className="px-2"
                        >
                          FIELDNAME
                          {getSortIndicator('FIELDNAME')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('ACCOUNTNUMBER')}
                          className="px-2"
                        >
                          ACCOUNTNUMBER
                          {getSortIndicator('ACCOUNTNUMBER')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('APPROVED')}
                          className="px-2"
                        >
                          APPROVED
                          {getSortIndicator('APPROVED')}
                        </Button>
                      </TableHead>
                       <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('STATUS')}
                          className="px-2"
                        >
                          STATUS
                          {getSortIndicator('STATUS')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('APPROVEUSER')}
                          className="px-2"
                        >
                          APPROVEUSER
                          {getSortIndicator('APPROVEUSER')}
                        </Button>
                      </TableHead>
                       <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCompanies.length > 0 ? (
                      paginatedCompanies.map((company) => (
                        <TableRow key={company.Oid}>
                          <TableCell>
                            <Link href={`/dashboard/allowed_companies/${company.Oid}`} className="font-medium hover:underline">{company.FIELDNAME}</Link>
                          </TableCell>
                          <TableCell>{company.ACCOUNTNUMBER}</TableCell>
                           <TableCell>
                             <Badge variant={company.APPROVED ? 'default' : 'secondary'}>{company.APPROVED ? 'Yes' : 'No'}</Badge>
                          </TableCell>
                          <TableCell>
                             <Badge variant={getStatusVariant(company.STATUS)}>{company.STATUS}</Badge>
                          </TableCell>
                          <TableCell>{company.APPROVEUSER || 'N/A'}</TableCell>
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
                                {!approvalView && <DropdownMenuItem onClick={() => handleEdit(company)}>Edit</DropdownMenuItem>}
                                {company.STATUS === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproval(company.Oid, true)}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleApproval(company.Oid, false)}>
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
                        <TableCell
                          colSpan={7}
                          className="text-center h-24 text-muted-foreground"
                        >
                          No companies found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
                <div className="text-xs text-muted-foreground">
                    Showing <strong>{paginatedCompanies.length}</strong> of <strong>{filteredAndSortedCompanies.length}</strong> companies
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
                        disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedCompanies.length}
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
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <AddAllowedCompanyForm setOpen={setIsAddCompanyOpen} />
      </DialogContent>
    </Dialog>
    <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            {selectedCompany && selectedCompany.hasOwnProperty('FIELDNAME') && (
                <EditAllowedCompanyForm
                    allowedCompany={selectedCompany as allowed_companies} 
                    setOpen={setIsEditCompanyOpen} 
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );

    