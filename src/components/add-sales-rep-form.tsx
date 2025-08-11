
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

const salesRepFormSchema = z.object({
  name: z.string().min(2, 'Sales rep name must be at least 2 characters.'),
  company: z.string().min(2, 'Company name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
});

type SalesRepFormValues = z.infer<typeof salesRepFormSchema>;

export function AddSalesRepForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const form = useForm<SalesRepFormValues>({
    resolver: zodResolver(salesRepFormSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
    },
  });

  function onSubmit(data: SalesRepFormValues) {
    console.log({ ...data, status: 'Pending' }); // In a real app, you'd handle form submission here
    toast({
      title: 'Sales Rep Submitted for Approval',
      description: `${data.name} has been successfully added and is awaiting verification.`,
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
              <FormLabel>Sales Rep Name</FormLabel>
              <FormControl>
                <Input placeholder="Alice Johnson" {...field} />
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
                <Input placeholder="alice.j@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="Innovate Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Sales Rep</Button>
        </div>
      </form>
    </Form>
  );
}
