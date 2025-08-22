
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useDataContext } from '@/context/data-context';
import type { SystemUser } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.').optional().or(z.literal('')),
  status: z.string(),
  roleId: z.string().uuid().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditSystemUserForm({ 
  user,
  setOpen, 
}: { 
  user: SystemUser;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updateSystemUser, roles } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
      status: user.status,
      roleId: user.roleId,
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
        const dataToUpdate: any = { ...data };
        if (!data.password) {
            delete dataToUpdate.password;
        }

        await updateSystemUser({ ...user, ...dataToUpdate });
        toast({
            title: 'System User Updated',
            description: `${data.name} has been successfully updated.`,
        });
        setOpen(false);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Failed to Update System User',
            description: error.message || 'An error occurred while trying to update the user.',
        });
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
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input placeholder="user@system.com" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl><Input type="password" placeholder="Leave blank to keep current" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value ?? ''}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {roles.map((role) => (
                        <SelectItem key={role.ID} value={role.ID}>
                            {role.ROLENAME}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
         <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </Form>
  );
}
