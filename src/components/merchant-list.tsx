
'use client';

import * as React from 'react';
import type { Merchant_users, allowed_companies } from '@/types';
import { ArrowUpDown } from 'lucide-react';

import { Badge, badgeVariants } from '@/components/ui/badge';
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
import { useDataContext } from '@/context/data-context';
import type { VariantProps } from 'class-variance-authority';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type SortableKeys = 'FULLNAME' | 'ACCOUNTNUMBER' | 'STATUS' | 'ROLE';
const ITEMS_PER_PAGE = 15;

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        success: "border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  }
)

const StatusBadge = ({ status }: { status: string }) => {
    let variant: VariantProps<typeof statusBadgeVariants>["variant"] = 'outline';
    let text = 'Unknown';

    switch (status?.toUpperCase()) {
        case 'A':
            variant = 'success';
            text = 'Active';
            break;
        case 'P':
            variant = 'secondary';
            text = 'Pending';
            break;
        case 'B':
            variant = 'destructive';
            text = 'Blocked';
            break;
        default:
            text = status;
            break;
    }
    return <div className={cn(statusBadgeVariants({ variant }))}>{text}</div>;
};


export default function MerchantList({ merchants: initialMerchants }: { merchants: Merchant_users[] }) {
  const { merchants: contextMerchants, allowedCompanies } = useDataContext();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{
    key: SortableKeys;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'FULLNAME', direction: 'ascending' });
  const [activeTab, setActiveTab] = React.useState('all');
  const [companyFilter, setCompanyFilter] = React.useState('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  

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
    let sourceData = contextMerchants;
    let sortableItems = [...sourceData];

    if (activeTab !== 'all') {
      sortableItems = sortableItems.filter(
        (merchant) => merchant.STATUS.toUpperCase() === activeTab
      );
    }
    
    if (companyFilter !== 'all') {
        sortableItems = sortableItems.filter(merchant => merchant.ACCOUNTNUMBER === companyFilter);
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
        sortableItems.sort((a, b) => {
            if (a.ROLE === 'Admin' && b.ROLE !== 'Admin') return -1;
            if (a.ROLE !== 'Admin' && b.ROLE === 'Admin') return 1;
            return 0;
        });
    }

    return sortableItems;
  }, [contextMerchants, searchTerm, sortConfig, activeTab, companyFilter, allowedCompanies]);
  
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
  
  return (
    <>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="A">Active</TabsTrigger>
              <TabsTrigger value="P">Pending</TabsTrigger>
              <TabsTrigger value="B">Blocked</TabsTrigger>
            </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
                <SelectTrigger className="h-8 w-[150px] lg:w-[250px]">
                    <SelectValue placeholder="Filter by company" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {allowedCompanies.map(company => (
                        <SelectItem key={company.Oid} value={company.ACCOUNTNUMBER}>
                            {company.FIELDNAME}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
              <CardTitle>Merchant Users</CardTitle>
              <CardDescription>
                Manage all merchant admins and sales representatives.
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
                      <TableHead>Company</TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('ACCOUNTNUMBER')} className="px-2">
                          Account Number
                          {getSortIndicator('ACCOUNTNUMBER')}
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('ROLE')} className="px-2">
                          Role
                          {getSortIndicator('ROLE')}
                        </Button>
                      </TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>
                        <Button variant="ghost" onClick={() => requestSort('STATUS')} className="px-2">
                          Status
                          {getSortIndicator('STATUS')}
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMerchants.length > 0 ? (
                      paginatedMerchants.map((merchantUser) => (
                        <TableRow key={merchantUser.ID}>
                          <TableCell className="font-medium">{merchantUser.FULLNAME}</TableCell>
                          <TableCell>{getCompanyName(merchantUser.ACCOUNTNUMBER)}</TableCell>
                          <TableCell>{merchantUser.ACCOUNTNUMBER}</TableCell>
                          <TableCell>
                             <Badge variant={merchantUser.ROLE === 'Admin' ? 'default' : 'secondary'}>{merchantUser.ROLE}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{merchantUser.PHONENUMBER}</TableCell>
                          <TableCell>
                            <StatusBadge status={merchantUser.STATUS} />
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
