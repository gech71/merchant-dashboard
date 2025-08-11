
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

const branchUserFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  branch: z.string({ required_error: 'Please select a branch.' }),
});

type BranchUserFormValues = z.infer<typeof branchUserFormSchema>;

// In a real app, this would be fetched from your API
const MOCK_BRANCHES = [
  { id: '1', name: 'Downtown Branch' },
  { id: '2', name: 'Uptown Branch' },
  { id: '3', name: 'Westside Branch' },
  { id: '4', name: 'Eastside Branch' },
  { id: '5', name: 'South Branch' },
];


export function AddBranchUserForm({ 
  setOpen, 
  onAddUser 
}: { 
  setOpen: (open: boolean) => void,
  onAddUser: (user: BranchUser) => void 
}) {
  const { toast } = useToast();
  const form = useForm<BranchUserFormValues>({
    resolver: zodResolver(branchUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  function onSubmit(data: BranchUserFormValues) {
    const newUser: BranchUser = {
        id: new Date().toISOString(),
        ...data,
        status: 'Pending'
    }
    onAddUser(newUser);
    toast({
      title: 'Branch User Submitted for Approval',
      description: `${data.name} has been successfully submitted and is awaiting verification.`,
    });
    setOpen(false);
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
                  {MOCK_BRANCHES.map(branch => (
                     <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add User</Button>
        </div>
      </form>
    </Form>
  );
}
