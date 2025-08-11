
'use client';

import * as React from 'react';
import type { Company, EditableItem } from '@/types';
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
import { AddCompanyForm } from './add-company-form';
import { EditCompanyForm } from './edit-company-form';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useDataContext } from '@/context/data-context';

type SortableKeys = 'fieldName' | 'accountNumber' | 'branch' | 'status' | 'approveUser' | 'approved';
const ITEMS_PER_PAGE = 15;

export default function CompanyList({ companies: initialCompanies, approvalView = false }: { companies: Company[], approvalView?: boolean }) {
  const { updateCompanyApproval, currentUser } = useDataContext();
  const [companies, setCompanies] = React.useState(initialCompanies);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'fieldName', direction: 'ascending' });
  const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<EditableItem>(null);
  const [activeTab, setActiveTab] = React.useState(approvalView ? 'pending' : 'all');
  const [currentPage, setCurrentPage] = React.useState(1);

  React.useEffect(() => {
    setCompanies(initialCompanies);
  }, [initialCompanies]);
  
  const handleApproval = (companyId: string, isApproved: boolean) => {
    updateCompanyApproval(companyId, isApproved);
  };
  
  const handleEdit = (company: Company) => {
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
    let sortableItems = [...companies];

    if (approvalView) {
      sortableItems = sortableItems.filter(c => c.status === 'Pending');
    }
    else if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (company) => company.status.toLowerCase() === activeTab
      );
    }
    
    if (searchTerm) {
      sortableItems = sortableItems.filter((company) =>
        company.fieldName.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [companies, searchTerm, sortConfig, activeTab, approvalView]);
  
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
  
  const getStatusVariant = (status: Company['status']) => {
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
              <CardTitle>{approvalView ? 'Company Approvals' : 'Companies'}</CardTitle>
              <CardDescription>
                {approvalView ? `Review and approve pending companies for ${currentUser.branch}.` : 'A list of all companies.'}
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
                          onClick={() => requestSort('fieldName')}
                          className="px-2"
                        >
                          Company
                          {getSortIndicator('fieldName')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('accountNumber')}
                          className="px-2"
                        >
                          Account Number
                          {getSortIndicator('accountNumber')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('branch')}
                          className="px-2"
                        >
                          Branch
                          {getSortIndicator('branch')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('approved')}
                          className="px-2"
                        >
                          Approved
                          {getSortIndicator('approved')}
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
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('approveUser')}
                          className="px-2"
                        >
                          Approved By
                          {getSortIndicator('approveUser')}
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
                        <TableRow key={company.id}>
                          <TableCell>
                            <Link href={`/dashboard/companies/${company.id}`} className="font-medium hover:underline">{company.fieldName}</Link>
                          </TableCell>
                          <TableCell>{company.accountNumber}</TableCell>
                          <TableCell>{company.branch}</TableCell>
                           <TableCell>
                             <Badge variant={company.approved ? 'default' : 'secondary'}>{company.approved ? 'Yes' : 'No'}</Badge>
                          </TableCell>
                          <TableCell>
                             <Badge variant={getStatusVariant(company.status)}>{company.status}</Badge>
                          </TableCell>
                          <TableCell>{company.approveUser || 'N/A'}</TableCell>
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
                                {company.status === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleApproval(company.id, true)}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleApproval(company.id, false)}>
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
        <AddCompanyForm setOpen={setIsAddCompanyOpen} />
      </DialogContent>
    </Dialog>
    <Dialog open={isEditCompanyOpen} onOpenChange={setIsEditCompanyOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
            </DialogHeader>
            {selectedCompany && selectedCompany.hasOwnProperty('fieldName') && (
                <EditCompanyForm 
                    company={selectedCompany as Company} 
                    setOpen={setIsEditCompanyOpen} 
                />
            )}
        </DialogContent>
    </Dialog>
    </>
  );
}
