
'use client';
import * as React from 'react';
import { useDataContext } from '@/context/data-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function UserRoleAssignmentPage() {
    const { merchants, branchUsers, roles, updateUserRole } = useDataContext();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('merchants');

    const handleRoleChange = async (userId: string, roleId: string, userType: 'merchant' | 'branch') => {
        try {
            await updateUserRole(userId, roleId, userType);
            toast({ title: 'Role Updated', description: "User's role has been successfully updated." });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: "Failed to update user's role." });
        }
    };

    const filteredMerchants = merchants.filter(user => user.FULLNAME?.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredBranchUsers = branchUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const merchantRoles = roles.filter(r => r.name.startsWith('Merchant'));
    const branchRoles = roles.filter(r => !r.name.startsWith('Merchant'));

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Role Assignment</CardTitle>
                <CardDescription>Assign roles to merchant and branch users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                     <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger value="merchants">Merchant Users</TabsTrigger>
                            <TabsTrigger value="branch">System Admins</TabsTrigger>
                        </TabsList>
                        <Input 
                            placeholder="Search by name..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    </div>
                    <TabsContent value="merchants" className="mt-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Account Number</TableHead>
                                        <TableHead>Current Role</TableHead>
                                        <TableHead>Assign New Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMerchants.map(user => (
                                        <TableRow key={user.ID}>
                                            <TableCell className="font-medium">{user.FULLNAME}</TableCell>
                                            <TableCell>{user.ACCOUNTNUMBER}</TableCell>
                                            <TableCell>{user.DashBoardRoles?.name || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                <Select onValueChange={(roleId) => handleRoleChange(user.ID, roleId, 'merchant')} defaultValue={user.roleId || ''}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {merchantRoles.map(role => (
                                                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    <TabsContent value="branch" className="mt-4">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Current Role</TableHead>
                                        <TableHead>Assign New Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBranchUsers.map(user => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.branch}</TableCell>
                                            <TableCell>{user.DashBoardRoles?.name || 'Unassigned'}</TableCell>
                                            <TableCell>
                                                <Select onValueChange={(roleId) => handleRoleChange(user.id.toString(), roleId, 'branch')} defaultValue={user.roleId || ''}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {branchRoles.map(role => (
                                                            <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    