
'use client';

import * as React from 'react';
import type { Company } from '@/types';
import { ArrowUpDown, PlusCircle, MoreHorizontal, CheckCircle, XCircle, Clock } from 'lucide-react';

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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddCompanyForm } from './add-company-form';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from './ui/dropdown-menu';

type SortableKeys = 'name' | 'sales' | 'status';

export default function CompanyList({ companies: initialCompanies }: { companies: Company[] }) {
  const [companies, setCompanies] = React.useState(initialCompanies);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'sales', direction: 'descending' });
  const [isAddCompanyOpen, setIsAddCompanyOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');

  const handleStatusChange = (companyId: string, status: 'Approved' | 'Rejected') => {
    setCompanies(companies.map(c => c.id === companyId ? { ...c, status } : c));
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

    if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (company) => company.status.toLowerCase() === activeTab
      );
    }
    
    if (searchTerm) {
      sortableItems = sortableItems.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [companies, searchTerm, sortConfig, activeTab]);

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
    <Dialog open={isAddCompanyOpen} onOpenChange={setIsAddCompanyOpen}>
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Company
                </span>
              </Button>
            </DialogTrigger>
          </div>
        </div>
        <TabsContent value={activeTab}>
          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
              <CardDescription>
                A list of all companies.
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
                          onClick={() => requestSort('name')}
                          className="px-2"
                        >
                          Company Name
                          {getSortIndicator('name')}
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
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort('sales')}
                          className="px-2"
                        >
                          Sales
                          {getSortIndicator('sales')}
                        </Button>
                      </TableHead>
                       <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedCompanies.length > 0 ? (
                      filteredAndSortedCompanies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={company.logoUrl}
                                  alt={`${company.name} logo`}
                                  data-ai-hint={company.hint}
                                />
                                <AvatarFallback>
                                  {company.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{company.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                             <Badge variant={getStatusVariant(company.status)}>{company.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(company.sales)}
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
                                {company.status === 'Pending' && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleStatusChange(company.id, 'Approved')}>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusChange(company.id, 'Rejected')}>
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
                          colSpan={4}
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
  );
}
