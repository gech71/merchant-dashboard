'use client';

import * as React from 'react';
import type { arifpay_endpoints } from '@/types';
import { ArrowUpDown, Edit, MoreHorizontal, Trash2, PlusCircle } from 'lucide-react';
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Image from 'next/image';
import { useDataContext } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { EditArifpayEndpointForm } from './edit-arifpay-endpoint-form';
import { AddArifpayEndpointForm } from './add-arifpay-endpoint-form';

type SortableKeys = 'BANK' | 'DISPLAYNAME' | 'ORDER' | 'TRANSACTIONTYPE' | 'OTPLENGTH' | 'BENEFICIARYBANK';
const ITEMS_PER_PAGE = 10;

export default function ArifpayEndpointList({ arifpayEndpoints: initialArifpayEndpoints }: { arifpayEndpoints: arifpay_endpoints[] }) {
  const { arifpayEndpoints, deleteArifpayEndpoint } = useDataContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'ORDER', direction: 'ascending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = React.useState<arifpay_endpoints | null>(null);

  const handleEdit = (endpoint: arifpay_endpoints) => {
    setSelectedEndpoint(endpoint);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = async (id: string) => {
    try {
      await deleteArifpayEndpoint(id);
      toast({
        title: "Endpoint Deleted",
        description: "The ArifPay endpoint has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete the endpoint.",
      });
    }
  };

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedEndpoints = React.useMemo(() => {
    let sortableItems = [...arifpayEndpoints];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((endpoint) => {
         if (searchField === 'all') {
             return Object.values(endpoint).some(val => String(val).toLowerCase().includes(lowercasedTerm))
         }
         const fieldValue = endpoint[searchField as keyof arifpay_endpoints] as string;
         return fieldValue?.toLowerCase().includes(lowercasedTerm)
      });
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [arifpayEndpoints, searchTerm, searchField, sortConfig]);

  const paginatedEndpoints = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedEndpoints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedEndpoints, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  const truncate = (str: string | null, num: number) => {
    if (!str) return 'N/A';
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ArifPay Endpoints</CardTitle>
              <CardDescription>A list of all configured ArifPay payment gateway endpoints.</CardDescription>
            </div>
             <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-9 gap-1">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add New Endpoint</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Add New ArifPay Endpoint</DialogTitle>
                    </DialogHeader>
                    <AddArifpayEndpointForm setOpen={setIsAddDialogOpen} />
                </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end py-4">
            <div className="flex items-center gap-2">
              <Select value={searchField} onValueChange={setSearchField}>
                    <SelectTrigger className="h-9 w-[180px]">
                        <SelectValue placeholder="Search by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Fields</SelectItem>
                        <SelectItem value="BANK">Bank</SelectItem>
                        <SelectItem value="DISPLAYNAME">Display Name</SelectItem>
                        <SelectItem value="TRANSACTIONTYPE">Transaction Type</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                  placeholder="Search endpoints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 max-w-sm"
                />
            </div>
          </div>
          <div className="rounded-md border">
            <TooltipProvider>
              <Table>
                  <TableHeader>
                  <TableRow>
                      <TableHead className="w-[50px]">Logo</TableHead>
                      <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('BANK')} className="px-2">Bank{getSortIndicator('BANK')}</Button></TableHead>
                      <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('DISPLAYNAME')} className="px-2">Display Name{getSortIndicator('DISPLAYNAME')}</Button></TableHead>
                      <TableHead className="whitespace-nowrap">Two Step</TableHead>
                      <TableHead className="whitespace-nowrap">OTP</TableHead>
                      <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('OTPLENGTH')} className="px-2">OTP Length{getSortIndicator('OTPLENGTH')}</Button></TableHead>
                      <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('TRANSACTIONTYPE')} className="px-2">Txn Type{getSortIndicator('TRANSACTIONTYPE')}</Button></TableHead>
                      <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('BENEFICIARYBANK')} className="px-2">Beneficiary Bank{getSortIndicator('BENEFICIARYBANK')}</Button></TableHead>
                      <TableHead className="whitespace-nowrap">Beneficiary Acct</TableHead>
                      <TableHead className="whitespace-nowrap">Endpoint 1</TableHead>
                      <TableHead className="whitespace-nowrap">Success URL</TableHead>
                      <TableHead className="whitespace-nowrap"><Button variant="ghost" onClick={() => requestSort('ORDER')} className="px-2">Order{getSortIndicator('ORDER')}</Button></TableHead>
                      <TableHead>Actions</TableHead>
                  </TableRow>
                  </TableHeader>
                  <TableBody>
                  {paginatedEndpoints.length > 0 ? (
                      paginatedEndpoints.map((endpoint) => (
                      <TableRow key={endpoint.ID}>
                          <TableCell>
                              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                                  <Image src={endpoint.IMAGEURL ?? `https://placehold.co/40x40.png`} alt={endpoint.BANK} width={40} height={40} className="object-cover" data-ai-hint="bank logo" />
                              </div>
                          </TableCell>
                          <TableCell className="font-medium">{endpoint.BANK}</TableCell>
                          <TableCell>{endpoint.DISPLAYNAME}</TableCell>
                          <TableCell><Badge variant={endpoint.ISTWOSTEP ? 'default' : 'secondary'}>{endpoint.ISTWOSTEP ? 'Yes' : 'No'}</Badge></TableCell>
                          <TableCell><Badge variant={endpoint.ISOTP ? 'default' : 'secondary'}>{endpoint.ISOTP ? 'Yes' : 'No'}</Badge></TableCell>
                          <TableCell>{endpoint.OTPLENGTH}</TableCell>
                          <TableCell>{endpoint.TRANSACTIONTYPE}</TableCell>
                          <TableCell>{endpoint.BENEFICIARYBANK}</TableCell>
                          <TableCell>{endpoint.BENEFICIARYACCOUNT}</TableCell>
                          {[endpoint.ENDPOINT1, endpoint.SUCCESSURL].map((url, index) => (
                            <TableCell key={index}>
                                <Tooltip>
                                  <TooltipTrigger>{truncate(url, 20)}</TooltipTrigger>
                                  <TooltipContent><p>{url || 'N/A'}</p></TooltipContent>
                                </Tooltip>
                            </TableCell>
                          ))}
                          <TableCell>{endpoint.ORDER}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEdit(endpoint)}>
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
                                                    This action cannot be undone. This will permanently delete the ArifPay endpoint.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(endpoint.ID)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Continue</AlertDialogAction>
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
                      <TableCell colSpan={13} className="h-24 text-center">No endpoints found.</TableCell>
                      </TableRow>
                  )}
                  </TableBody>
              </Table>
            </TooltipProvider>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{paginatedEndpoints.length}</strong> of <strong>{filteredAndSortedEndpoints.length}</strong> endpoints
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
              disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedEndpoints.length}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
                <DialogTitle>Edit ArifPay Endpoint</DialogTitle>
            </DialogHeader>
            {selectedEndpoint && (
                <EditArifpayEndpointForm
                    endpoint={selectedEndpoint}
                    setOpen={setIsEditDialogOpen}
                />
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
