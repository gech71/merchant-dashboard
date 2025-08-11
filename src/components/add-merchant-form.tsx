
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
import { Merchant, Company } from '@/types';

const merchantFormSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters.'),
  company: z.string({ required_error: 'Please select a company.' }),
  email: z.string().email('Please enter a valid email address.'),
  role: z.enum(['Admin', 'Sales'], { required_error: 'Please select a role.' }),
});

type MerchantFormValues = z.infer<typeof merchantFormSchema>;

// In a real app, this would be fetched from your API
const MOCK_COMPANIES: Pick<Company, 'id' | 'fieldName'>[] = [
    { id: '1', fieldName: 'Innovate Inc.'},
    { id: '2', fieldName: 'Apex Solutions'},
    { id: '3', fieldName: 'Quantum Corp'},
    { id: '4', fieldName: 'Synergy Systems'},
    { id: '5', fieldName: 'Pioneer Ltd.'},
    { id: '6', fieldName: 'Zenith Ventures'},
    { id: '7', fieldName: 'Starlight Co.'},
    { id: '8', fieldName: 'Momentum'},
    { id: '9', fieldName: 'Nexus Group'},
    { id: '10', fieldName: 'Horizon Dynamics'},
];

// In a real app, this would be fetched from your API
const MOCK_EXISTING_MERCHANTS: Pick<Merchant, 'company' | 'role'>[] = [
    { company: 'Innovate Inc.', role: 'Admin' },
    { company: 'Apex Solutions', role: 'Admin' },
    { company: 'Quantum Corp', role: 'Admin' },
    { company: 'Synergy Systems', role: 'Admin' },
    { company: 'Pioneer Ltd.', role: 'Admin' },
];


export function AddMerchantForm({ 
  setOpen, 
  onAddMerchant 
}: { 
  setOpen: (open: boolean) => void,
  onAddMerchant: (merchant: Merchant) => void 
}) {
  const { toast } = useToast();
  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  function onSubmit(data: MerchantFormValues) {
    if (data.role === 'Admin') {
      const adminExists = MOCK_EXISTING_MERCHANTS.some(
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

    onAddMerchant(newMerchant);
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
                  {MOCK_COMPANIES.map(company => (
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
