
'use client';

import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDataContext } from '@/context/data-context';
import { Building, Home, Users, CheckSquare } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = {
  active: 'hsl(var(--chart-1))',
  pending: 'hsl(var(--chart-2))',
  inactive: 'hsl(var(--chart-3))',
  rejected: 'hsl(var(--chart-4))',
};

export default function DashboardPage() {
  const { companies, branches, merchants, branchUsers } = useDataContext();

  const totalCompanies = companies.length;
  const totalBranches = branches.length;
  const totalMerchantUsers = merchants.length;
  const totalBranchUsers = branchUsers.length;

  const pendingCompanies = companies.filter(c => c.status === 'Pending').length;
  const pendingBranches = branches.filter(b => b.status === 'Pending').length;
  const pendingMerchants = merchants.filter(m => m.status === 'Pending').length;
  const pendingBranchUsers = branchUsers.filter(u => u.status === 'Pending').length;
  const totalPending = pendingCompanies + pendingBranches + pendingMerchants + pendingBranchUsers;

  const companiesByBranch = branches.map(branch => ({
    name: branch.name,
    companies: companies.filter(c => c.branch === branch.name).length,
  }));

  const companyStatusData = [
    { name: 'Active', value: companies.filter(c => c.status === 'Active').length },
    { name: 'Pending', value: companies.filter(c => c.status === 'Pending').length },
    { name: 'Inactive', value: companies.filter(c => c.status === 'Inactive').length },
  ];
  
  const pieColors = [COLORS.active, COLORS.pending, COLORS.inactive];

  return (
    <div className="flex flex-col gap-6">
       <CardHeader className="p-0">
          <CardTitle className="text-3xl">Dashboard</CardTitle>
          <CardDescription>A summary of your merchant ecosystem.</CardDescription>
        </CardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompanies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBranches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMerchantUsers + totalBranchUsers}</div>
            <p className="text-xs text-muted-foreground">{totalMerchantUsers} Merchant, {totalBranchUsers} Branch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
             <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Companies per Branch</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={{}} className="h-[300px] w-full">
                <BarChart data={companiesByBranch}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <Tooltip 
                      cursor={{fill: 'hsl(var(--muted))'}}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="companies" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Company Status</CardTitle>
             <CardDescription>Distribution of all registered companies.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={companyStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {companyStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
