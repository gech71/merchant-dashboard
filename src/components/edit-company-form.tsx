
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
import type { Company } from '@/types';
import { useDataContext } from '@/context/data-context';

const companyFormSchema = z.object({
  fieldName: z.string().min(2, 'Field name must be at least 2 characters.'),
  accountNumber: z.string().min(4, 'Account number must be at least 4 characters.'),
  branch: z.string({ required_error: 'Please select a branch.' }),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;


export function EditCompanyForm({ 
  company,
  setOpen, 
}: { 
  company: Company,
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { branches, updateCompany, currentUser } = useDataContext();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      fieldName: company.fieldName,
      accountNumber: company.accountNumber,
      branch: company.branch,
    },
  });

  function onSubmit(data: CompanyFormValues) {
    const updatedCompany: Company = {
      ...company,
      ...data,
    };
    updateCompany(updatedCompany);
    toast({
      title: 'Company Updated',
      description: `${data.fieldName} has been successfully updated.`,
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fieldName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="Innovate Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="ACC12345" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches.map(branch => (
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
            <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
