
'use client';
import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useDataContext } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/types';
import { ScrollArea } from './ui/scroll-area';

const ALL_PAGES = [
  { id: '/dashboard', label: 'Dashboard' },
  { id: '/dashboard/allowed_companies', label: 'Allowed Companies' },
  { id: '/dashboard/branches', label: 'Branches' },
  { id: '/dashboard/branch-users', label: 'Branch Users' },
  { id: '/dashboard/merchant_users', label: 'Merchant Users' },
  { id: '/dashboard/account-infos', label: 'Account Infos' },
  { id: '/dashboard/promo-adds', label: 'Promo Ads' },
  { id: '/dashboard/daily-balances', label: 'Daily Balances' },
  { id: '/dashboard/merchant-txns', label: 'Merchant Transactions' },
  { id: '/dashboard/arif-requests', label: 'Arif Requests' },
  { id: '/dashboard/paystream-txns', label: 'PayStream Transactions' },
  { id: '/dashboard/qr-payments', label: 'QR Payments' },
  { id: '/dashboard/arifpay-endpoints', label: 'ArifPay Endpoints' },
  { id: '/dashboard/controllers-configs', label: 'Controller Configs' },
  { id: '/dashboard/core-integration-settings', label: 'Core Integration Settings' },
  { id: '/dashboard/stream-pay-settings', label: 'StreamPay Settings' },
  { id: '/dashboard/ussd-push-settings', label: 'USSD Push Settings' },
  { id: '/dashboard/role-capabilities', label: 'Legacy Role Capabilities' },
  { id: '/dashboard/approvals/allowed_companies', label: 'Approvals: Allowed Companies' },
  { id: '/dashboard/approvals/branch_users', label: 'Approvals: Branch Users' },
  { id: '/dashboard/role-management', label: 'Role Management' },
  { id: '/dashboard/user-role-assignment', label: 'User Role Assignment' },
];

const roleFormSchema = z.object({
    name: z.string().min(2, 'Role name is required.'),
    description: z.string().optional(),
    permissions: z.object({
        pages: z.array(z.string()).refine(value => value.some(item => item), {
            message: "You have to select at least one page.",
        }),
    })
});

type RoleFormValues = z.infer<typeof roleFormSchema>;

export function RoleForm({ setOpen, role }: { setOpen: (open: boolean) => void, role: Role | null }) {
    const { addRole, updateRole } = useDataContext();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    const defaultValues = {
        name: role?.name || '',
        description: role?.description || '',
        permissions: {
            pages: (role?.permissions as { pages: string[] })?.pages || []
        }
    };

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(roleFormSchema),
        defaultValues,
    });
    
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "permissions.pages"
    });

    async function onSubmit(data: RoleFormValues) {
        setIsLoading(true);
        try {
            if (role) {
                await updateRole({ ...role, ...data });
                toast({ title: "Role Updated", description: "The role has been successfully updated." });
            } else {
                await addRole(data);
                toast({ title: "Role Created", description: "The new role has been successfully created." });
            }
            setOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: "An error occurred." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="permissions.pages"
                    render={() => (
                        <FormItem>
                             <div className="mb-4">
                                <FormLabel className="text-base">Permissions</FormLabel>
                            </div>
                            <ScrollArea className="h-72 w-full rounded-md border p-4">
                                {ALL_PAGES.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="permissions.pages"
                                        render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={item.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                            ? field.onChange([...field.value, item.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                    (value) => value !== item.id
                                                                )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {item.label}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                        }}
                                    />
                                ))}
                            </ScrollArea>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                </div>
            </form>
        </Form>
    );
}
