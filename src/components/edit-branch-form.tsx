
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
import type { Branch } from '@/types';
import { useDataContext } from '@/context/data-context';

const branchFormSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters.'),
  code: z.string().min(2, 'Branch code must be at least 2 characters.'),
  address: z.string().min(10, 'Address must be at least 10 characters.'),
  contact: z.string().min(10, 'Contact number must be at least 10 characters.'),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

export function EditBranchForm({ 
  branch,
  setOpen, 
}: { 
  branch: Branch,
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { updateBranch } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: branch.name,
      code: branch.code,
      address: branch.address,
      contact: branch.contact,
    },
  });

  async function onSubmit(data: BranchFormValues) {
    setIsLoading(true);
    try {
      await updateBranch({ ...branch, ...data });
      toast({
        title: 'Branch Updated',
        description: `${data.name} has been successfully updated.`,
      });
      setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to Update Branch',
            description: 'An error occurred while trying to update the branch.',
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
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="Downtown Branch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Code</FormLabel>
              <FormControl>
                <Input placeholder="DT001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Anytown, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact</FormLabel>
              <FormControl>
                <Input placeholder="555-1234" {...field} />
              </FormControl>
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
