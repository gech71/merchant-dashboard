
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
import type { Branch } from '@/types';

const branchFormSchema = z.object({
  name: z.string().min(2, 'Branch name must be at least 2 characters.'),
  code: z.string().min(2, 'Branch code must be at least 2 characters.'),
  address: z.string().min(10, 'Address must be at least 10 characters.'),
  contact: z.string().min(10, 'Contact number must be at least 10 characters.'),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

export function AddBranchForm({ 
  setOpen, 
}: { 
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { addBranch } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      contact: '',
    },
  });

  async function onSubmit(data: BranchFormValues) {
    setIsLoading(true);
    try {
        await addBranch(data);
        toast({
          title: 'Branch Added',
          description: `${data.name} has been successfully added.`,
        });
        setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to Add Branch',
            description: 'An error occurred while trying to add the branch.',
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
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Branch'}</Button>
        </div>
      </form>
    </Form>
  );
}
