
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

const allowedCompanyFormSchema = z.object({
  ID: z.string().min(1, 'ID is required'),
  ACCOUNTNUMBER: z.string().min(4, 'Account number must be at least 4 characters.'),
  FIELDNAME: z.string().min(2, 'Field name must be at least 2 characters.'),
});

type AllowedCompanyFormValues = z.infer<typeof allowedCompanyFormSchema>;


export function AddAllowedCompanyForm({ 
  setOpen, 
}: { 
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { addAllowedCompany } = useDataContext();

  const form = useForm<AllowedCompanyFormValues>({
    resolver: zodResolver(allowedCompanyFormSchema),
    defaultValues: {
      ID: '',
      FIELDNAME: '',
      ACCOUNTNUMBER: '',
    },
  });

  function onSubmit(data: AllowedCompanyFormValues) {
    addAllowedCompany(data);
    toast({
      title: 'Company Submitted for Approval',
      description: `${data.FIELDNAME} has been sent for verification.`,
    });
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input placeholder="C006" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="FIELDNAME"
          render={({ field }) => (
            <FormItem>
              <FormLabel>FIELDNAME</FormLabel>
              <FormControl>
                <Input placeholder="Innovate Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ACCOUNTNUMBER"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ACCOUNTNUMBER</FormLabel>
              <FormControl>
                <Input placeholder="ACC12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Add Company</Button>
        </div>
      </form>
    </Form>
  );
}
