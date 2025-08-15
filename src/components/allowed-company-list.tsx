'use client';

import * as React from 'react';
import type { allowed_companies, EditableItem } from '@/types';
import { ArrowUpDown, PlusCircle, MoreHorizontal, CheckCircle, XCircle, Edit } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

type SortableKeys = 'FIELDNAME' | 'ACCOUNTNUMBER' | 'STATUS' | 'APPROVEUSER' | 'APPROVED';
const ITEMS_PER_PAGE = 15;

export default function AllowedCompanyList({ allowedCompanies: initialCompanies, approvalView = false }: { allowed_companies[], approvalView?: boolean }) {
  const { allowedCompanies: contextCompanies, updateAllowedCompanyApproval } = useDataContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'FIELDNAME', direction: 'ascending' });
  const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false);
  const [isEditCompanyOpen, setIsEditCompanyOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState<EditableItem>(null);
  const [activeTab, setActiveTab] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleApproval = async (companyId: string, isApproved: boolean) => {
    try {
        await updateAllowedCompanyApproval(companyId, isApproved);
        toast({
            title: 'Approval Status Updated',
            description: `The company has been ${isApproved ? 'approved' : 'rejected'}.`,
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update the approval status.',
        });
    }
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
  
  const companiesSource = approvalView ? contextCompanies.filter(c => !c.APPROVED) : contextCompanies;

  const filteredAndSortedCompanies = React.useMemo(() => {
    let sortableItems = [...companiesSource];

    if (!approvalView) {
      if (activeTab === 'active') {
          sortableItems = sortableItems.filter(c => c.STATUS);
      } else if (activeTab === 'inactive') {
          sortableItems = sortableItems.filter(c => !c.STATUS && c.APPROVED); // Inactive means approved but not active
      } else if (activeTab === 'pending') {
          sortableItems = sortableItems.filter(c => !c.APPROVED);
      }
    }
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((company) => {
          if (searchField === 'all') {
            return Object.values(company).some(val => String(val).toLowerCase().includes(lowercasedTerm))
          }
          const fieldValue = company[searchField as keyof allowed_companies] as string;
          return fieldValue?.toLowerCase().includes(lowercasedTerm);
      });
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
  }, [companiesSource, searchTerm, searchField, sortConfig, activeTab, approvalView]);
  
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
  
  const getStatusBadge = (company: allowed_companies) => {
    if (!company.APPROVED) {
        return <Badge variant="secondary">Pending</Badge>;
    }
    if (company.STATUS) {
        return <Badge variant="default">Active</Badge>;
    }
    return <Badge variant="destructive">Inactive</Badge>;
  };

  const renderTabs = () => {
    if (approvalView) {
      return (
        <TabsContent value="pending">
          {renderCard()}
        </TabsContent>
      )
    }
    return (
      <>
        <TabsContent value="all">{renderCard()}</TabsContent>
        <TabsContent value="active">{renderCard()}</TabsContent>
        <TabsContent value="inactive">{renderCard()}</TabsContent>
        <TabsContent value="pending">{renderCard()}</TabsContent>
      </>
    )
  }

  const renderCard = () => (
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
                        <Button variant="ghost" onClick={() => requestSort('FIELDNAME')} className="px-2">
                          Company Name
                          {getSortIndicator('FIELDNAME')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('ACCOUNTNUMBER')} className="px-2">
                          Account Number
                          {getSortIndicator('ACCOUNTNUMBER')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('APPROVED')} className="px-2">
                          Approved
                          {getSortIndicator('APPROVED')}
                        </Button>
                      </TableHead>
                       <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('STATUS')} className="px-2">
                          Status
                          {getSortIndicator('STATUS')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('APPROVEUSER')} className="px-2">
                          Approved By
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
                             {getStatusBadge(company)}
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
                                {!approvalView && !company.APPROVED && (
                                  <DropdownMenuItem onClick={() => handleEdit(company)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {approvalView && !company.APPROVED && (
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
  )


  return (
    <>
    <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
      <Tabs defaultValue={approvalView ? 'pending' : 'all'} onValueChange={setActiveTab}>
        <div className="flex items-center">
          {!approvalView && (
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Select value={searchField} onValueChange={setSearchField}>
                <SelectTrigger className="h-8 w-[150px] lg:w-[180px]">
                    <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Fields</SelectItem>
                    <SelectItem value="FIELDNAME">Company Name</SelectItem>
                    <SelectItem value="ACCOUNTNUMBER">Account Number</SelectItem>
                </SelectContent>
            </Select>
            <Input
              placeholder="Search..."
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
        {renderTabs()}
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
