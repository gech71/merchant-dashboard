
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

const companyFormSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters.'),
  sales: z.coerce.number().min(0, 'Sales must be a positive number.'),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export function AddCompanyForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      sales: 0,
    },
  });

  function onSubmit(data: CompanyFormValues) {
    // In a real app, you'd handle form submission here, setting status to 'Pending'
    console.log({ ...data, status: 'Pending' }); 
    toast({
      title: 'Company Submitted for Approval',
      description: `${data.name} has been sent for verification.`,
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Innovate Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sales (USD)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="150000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Company</Button>
        </div>
      </form>
    </Form>
  );
}
