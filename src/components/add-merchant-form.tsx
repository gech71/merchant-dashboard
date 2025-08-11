
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
import { Merchant } from '@/types';
import { useDataContext } from '@/context/data-context';

const merchantFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  company: z.string({ required_error: 'Please select a company.' }),
  email: z.string().email('Please enter a valid email address.'),
  role: z.enum(['Admin', 'Sales'], { required_error: 'Please select a role.' }),
});

type MerchantFormValues = z.infer<typeof merchantFormSchema>;


export function AddMerchantForm({ 
  setOpen, 
}: { 
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { companies, merchants, addMerchant } = useDataContext();

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  function onSubmit(data: MerchantFormValues) {
    if (data.role === 'Admin') {
      const adminExists = merchants.some(
        (merchant) => merchant.company === data.company && merchant.role === 'Admin'
      );
      if (adminExists) {
        form.setError('company', { 
            type: 'manual', 
            message: `An Admin user already exists for ${data.company}.` 
        });
        return;
      }
    }
    
    const newMerchant: Merchant = {
      id: new Date().toISOString(),
      ...data,
      status: 'Pending'
    };

    addMerchant(newMerchant);
    toast({
      title: 'Merchant User Submitted for Approval',
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
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companies.map(company => (
                     <SelectItem key={company.id} value={company.fieldName}>{company.fieldName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
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
                <Input placeholder="user@company.com" {...field} />
              </FormControl>
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
