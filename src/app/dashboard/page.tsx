
'use client';

import * as React from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useDataContext } from '@/context/data-context';
import { Building, Users, CheckSquare, DollarSign, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const COLORS = {
  active: 'hsl(var(--chart-1))',
  pending: 'hsl(var(--chart-2))',
  inactive: 'hsl(var(--chart-3))',
  rejected: 'hsl(var(--chart-4))',
  disabled: 'hsl(var(--chart-5))',
  approved: 'hsl(var(--chart-1))',
  completed: 'hsl(var(--chart-1))',
  failed: 'hsl(var(--chart-4))',
};

const pieColors = [COLORS.active, COLORS.pending, COLORS.inactive, COLORS.rejected, COLORS.disabled];
const txnPieColors = [COLORS.completed, COLORS.pending, COLORS.failed];


const CustomPieChart = ({ title, description, data, colors }: { title: string, description: string, data: {name: string, value: number}[], colors: string[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <PieChart>
                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Legend />
                </PieChart>
            </ChartContainer>
        </CardContent>
    </Card>
)

export default function DashboardPage() {
  const { allowedCompanies, merchants, merchantTxns } = useDataContext();

  const totalCompanies = allowedCompanies.length;
  const totalMerchantUsers = merchants.length;

  const pendingCompanies = allowedCompanies.filter(c => !c.APPROVED).length;
  const pendingMerchants = merchants.filter(m => m.STATUS === 'Pending').length;
  const totalPending = pendingCompanies + pendingMerchants;

  const successfulTxns = merchantTxns.filter(t => t.STATUS === 'Completed');
  const totalTxnVolume = successfulTxns.reduce((acc, txn) => acc + txn.AMOUNT, 0);
  const totalTxnCount = successfulTxns.length;

  const companyStatusData = [
    { name: 'Active', value: allowedCompanies.filter(c => c.STATUS).length },
    { name: 'Pending Approval', value: pendingCompanies },
    { name: 'Inactive', value: allowedCompanies.filter(c => !c.STATUS).length },
  ];
  
  const merchantStatusData = [
    { name: 'Active', value: merchants.filter(m => m.STATUS === 'Active').length },
    { name: 'Pending', value: pendingMerchants },
    { name: 'Disabled', value: merchants.filter(m => m.STATUS === 'Disabled').length },
  ];
  
  const transactionStatusData = [
    { name: 'Completed', value: merchantTxns.filter(t => t.STATUS === 'Completed').length },
    { name: 'Pending', value: merchantTxns.filter(t => t.STATUS === 'Pending').length },
    { name: 'Failed', value: merchantTxns.filter(t => t.STATUS === 'Failed').length },
  ];


  return (
    <div className="flex flex-col gap-6">
       <CardHeader className="p-0">
          <CardTitle className="text-3xl">Dashboard</CardTitle>
          <CardDescription>A comprehensive summary of your merchant ecosystem.</CardDescription>
        </CardHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMerchantUsers}</div>
            <p className="text-xs text-muted-foreground">{totalMerchantUsers} Merchant Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Txn Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTxnVolume.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTxnCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
             <p className="text-xs text-muted-foreground">
                {pendingCompanies} Companies, {pendingMerchants} Merchants
             </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CustomPieChart title="Company Status" description="Distribution of all registered companies." data={companyStatusData} colors={pieColors} />
        <CustomPieChart title="Transaction Status" description="Distribution of all merchant transactions." data={transactionStatusData} colors={txnPieColors} />
        <CustomPieChart title="Merchant User Status" description="Distribution of all merchant users." data={merchantStatusData} colors={pieColors} />
      </div>
    </div>
  );
}

    