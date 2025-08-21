'use client';

import * as React from 'react';
import type { AuditLog } from '@/types';
import { ArrowUpDown, Eye, History } from 'lucide-react';
import { format } from 'date-fns';

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
import { Badge } from '@/components/ui/badge';
import { useDataContext } from '@/context/data-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


type SortableKeys = 'tableName' | 'recordId' | 'action' | 'changedBy' | 'changedAt';
const ITEMS_PER_PAGE = 20;

export default function AuditLogList({ auditLogs: initialAuditLogs }: { auditLogs: AuditLog[] }) {
  const { systemUsers, merchants, auditLogs, restoreFromAuditLog } = useDataContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('all');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'changedAt', direction: 'descending' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [logToRestore, setLogToRestore] = React.useState<AuditLog | null>(null);

  const handleRestore = async () => {
    if (!logToRestore) return;
    try {
      await restoreFromAuditLog(logToRestore.id);
      toast({
        title: 'Record Restored',
        description: `The record from ${logToRestore.tableName} has been successfully restored.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Restore Failed',
        description: 'An error occurred while trying to restore the record.',
      });
    } finally {
      setLogToRestore(null);
    }
  };

  const getUserName = (userId: string) => {
    const systemUser = systemUsers.find(u => u.id === userId);
    if (systemUser) return systemUser.name;
    const merchantUser = merchants.find(u => u.ID === userId);
    if (merchantUser) return merchantUser.FULLNAME;
    return userId;
  };

  const requestSort = (key: SortableKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getActionVariant = (action: string) => {
    switch (action) {
      case 'UPDATE':
        return 'default';
      case 'DELETE':
        return 'destructive';
       case 'RESTORE':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const filteredAndSortedLogs = React.useMemo(() => {
    let sortableItems = [...auditLogs];

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((log) => {
        if (searchField === 'all') {
          return Object.values(log).some(val => String(val).toLowerCase().includes(lowercasedTerm)) ||
                 getUserName(log.changedBy).toLowerCase().includes(lowercasedTerm);
        }
        if (searchField === 'changedBy') {
          return getUserName(log.changedBy).toLowerCase().includes(lowercasedTerm);
        }
        const fieldValue = log[searchField as keyof AuditLog] as string;
        return fieldValue?.toString().toLowerCase().includes(lowercasedTerm);
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
  }, [auditLogs, searchTerm, searchField, sortConfig]);

  const paginatedLogs = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedLogs, currentPage]);

  const getSortIndicator = (key: SortableKeys) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };
  
  const parseJsonData = (data: any) => {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data; // Return original string if parsing fails
        }
    }
    return data;
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>A record of all data modifications in the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-end gap-2 py-4">
           <Select value={searchField} onValueChange={setSearchField}>
              <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Search by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Fields</SelectItem>
                <SelectItem value="tableName">Table Name</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="recordId">Record ID</SelectItem>
                <SelectItem value="changedBy">Changed By</SelectItem>
              </SelectContent>
            </Select>
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Button variant="ghost" onClick={() => requestSort('changedAt')} className="px-2">Timestamp{getSortIndicator('changedAt')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('tableName')} className="px-2">Table{getSortIndicator('tableName')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('action')} className="px-2">Action{getSortIndicator('action')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('changedBy')} className="px-2">Changed By{getSortIndicator('changedBy')}</Button></TableHead>
                <TableHead><Button variant="ghost" onClick={() => requestSort('recordId')} className="px-2">Record ID{getSortIndicator('recordId')}</Button></TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(new Date(log.changedAt), 'PPpp')}</TableCell>
                    <TableCell>{log.tableName}</TableCell>
                    <TableCell><Badge variant={getActionVariant(log.action)}>{log.action}</Badge></TableCell>
                    <TableCell>{getUserName(log.changedBy)}</TableCell>
                    <TableCell className="font-mono text-xs">{log.recordId}</TableCell>
                    <TableCell className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Audit Log Details</DialogTitle>
                            <DialogDescription>
                              Change record for {log.tableName} at {format(new Date(log.changedAt), 'PPpp')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto">
                             <div>
                                <h3 className="font-semibold mb-2">New Value</h3>
                                <div className="p-2 border rounded-md bg-muted/50 text-xs">
                                {log.newValue ? (
                                    <JSONPretty data={parseJsonData(log.newValue)} themeClassName="bg-transparent p-0" />
                                ) : (
                                    <p className="text-muted-foreground">N/A (Record Deleted)</p>
                                )}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Old Value</h3>
                                <div className="p-2 border rounded-md bg-muted/50 text-xs">
                                    <JSONPretty data={parseJsonData(log.oldValue)} themeClassName="bg-transparent p-0" />
                                </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {log.action === 'DELETE' && (
                        <Button variant="outline" size="icon" onClick={() => setLogToRestore(log)}>
                          <History className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">No logs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>{paginatedLogs.length}</strong> of <strong>{filteredAndSortedLogs.length}</strong> logs
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
            disabled={currentPage * ITEMS_PER_PAGE >= filteredAndSortedLogs.length}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
    <AlertDialog open={!!logToRestore} onOpenChange={(open) => !open && setLogToRestore(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to restore this record?</AlertDialogTitle>
                <AlertDialogDescription>
                    This will recreate the deleted record from the table: <strong>{logToRestore?.tableName}</strong>. This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRestore}>Restore</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
