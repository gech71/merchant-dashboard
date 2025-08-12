
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { BranchUser } from '@/types';
import { useDataContext } from '@/context/data-context';

const branchUserFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  branch: z.string({ required_error: 'Please select a branch.' }),
});

type BranchUserFormValues = z.infer<typeof branchUserFormSchema>;

export function EditBranchUserForm({
  user,
  setOpen,
}: {
  user: BranchUser;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { branches, updateBranchUser } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BranchUserFormValues>({
    resolver: zodResolver(branchUserFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      branch: user.branch,
    },
  });

  async function onSubmit(data: BranchUserFormValues) {
    setIsLoading(true);
    try {
        await updateBranchUser({ ...user, ...data });
        toast({
            title: 'Branch User Updated',
            description: `${data.name} has been successfully updated.`,
        });
        setOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Failed to Update Branch User',
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
                <Input placeholder="user@branch.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
