
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
import type { SystemUser } from '@/types';
import { useDataContext } from '@/context/data-context';

const systemUserFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.').or(z.literal('')),
});

type SystemUserFormValues = z.infer<typeof systemUserFormSchema>;

export function EditSystemUserForm({
  user,
  setOpen,
}: {
  user: SystemUser;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updateSystemUser } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SystemUserFormValues>({
    resolver: zodResolver(systemUserFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: '',
    },
  });

  async function onSubmit(data: SystemUserFormValues) {
    setIsLoading(true);
    try {
        const dataToUpdate: any = { ...user, name: data.name, email: data.email };
        if (data.password) {
            dataToUpdate.password = data.password;
        }
        await updateSystemUser(dataToUpdate);
        toast({
            title: 'System User Updated',
            description: `${data.name} has been successfully updated.`,
        });
        setOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Failed to Update System User',
            description: 'An error occurred while trying to update the user.',
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
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="user@system.com" {...field} />
              </FormControl>
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
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </Form>
  );
}
