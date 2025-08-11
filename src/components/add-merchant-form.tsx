
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

const merchantFormSchema = z.object({
  name: z.string().min(2, 'Admin name must be at least 2 characters.'),
  company: z.string().min(2, 'Company name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
});

type MerchantFormValues = z.infer<typeof merchantFormSchema>;

export function AddMerchantForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();
  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
    },
  });

  function onSubmit(data: MerchantFormValues) {
    // In a real app, you'd check if an admin for this company already exists.
    // For now, we'll assume it's valid.
    console.log({ ...data, role: 'Admin', status: 'Pending' }); 
    toast({
      title: 'Merchant Admin Submitted for Approval',
      description: `${data.name} has been successfully submitted for verification.`,
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
              <FormLabel>Admin Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@innovate.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Admin User</Button>
        </div>
      </form>
    </Form>
  );
}
