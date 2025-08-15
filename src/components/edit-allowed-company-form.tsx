
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
import type { allowed_companies } from '@/types';
import { useDataContext } from '@/context/data-context';

const allowedCompanyFormSchema = z.object({
  FIELDNAME: z.string().min(2, 'Field name must be generated.'),
  ACCOUNTNUMBER: z.string().min(4, 'Account number must be at least 4 characters.'),
});

type AllowedCompanyFormValues = z.infer<typeof allowedCompanyFormSchema>;


export function EditAllowedCompanyForm({ 
  allowedCompany,
  setOpen, 
}: { 
  allowedCompany: allowed_companies,
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { updateAllowedCompany, allowedCompanies } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldNameIsSet, setFieldNameIsSet] = React.useState(true);

  const form = useForm<AllowedCompanyFormValues>({
    resolver: zodResolver(allowedCompanyFormSchema),
    defaultValues: {
      FIELDNAME: allowedCompany.FIELDNAME,
      ACCOUNTNUMBER: allowedCompany.ACCOUNTNUMBER,
    },
  });

  const handleGenerateName = async () => {
    const isAccountNumberValid = await form.trigger('ACCOUNTNUMBER');
    const accountNumber = form.getValues('ACCOUNTNUMBER');

    if (!isAccountNumberValid) {
        form.setValue('FIELDNAME', '');
        setFieldNameIsSet(false);
        return;
    }
    
    // Check for duplicates, excluding the current company being edited
    const alreadyExists = allowedCompanies.some(c => c.ACCOUNTNUMBER === accountNumber && c.Oid !== allowedCompany.Oid);
    if (alreadyExists) {
        form.setError('ACCOUNTNUMBER', {
            type: 'manual',
            message: 'Another company with this account number already exists.',
        });
        form.setValue('FIELDNAME', '');
        setFieldNameIsSet(false);
        return;
    }

    const randomName = `NewCo-${Math.floor(Math.random() * 10000)}`;
    form.setValue('FIELDNAME', randomName, { shouldValidate: true });
    setFieldNameIsSet(true);
    form.clearErrors('ACCOUNTNUMBER');
  }

  async function onSubmit(data: AllowedCompanyFormValues) {
    setIsLoading(true);

    const alreadyExists = allowedCompanies.some(c => c.ACCOUNTNUMBER === data.ACCOUNTNUMBER && c.Oid !== allowedCompany.Oid);
    if (alreadyExists) {
        form.setError('ACCOUNTNUMBER', {
            type: 'manual',
            message: 'Another company with this account number already exists.',
        });
        setIsLoading(false);
        return;
    }

    try {
        await updateAllowedCompany({ ...allowedCompany, ...data });
        toast({
            title: 'Company Updated',
            description: `${data.FIELDNAME} has been successfully updated and is awaiting re-approval.`,
        });
        setOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Failed to Update Company',
            description: 'An error occurred while trying to update the company.',
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
          name="ACCOUNTNUMBER"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ACCOUNTNUMBER</FormLabel>
               <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Enter account number" {...field} />
                </FormControl>
                 <Button type="button" variant="outline" onClick={handleGenerateName}>Get Company Name</Button>
              </div>
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
                <Input placeholder="Company Name" {...field} readOnly />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !fieldNameIsSet}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </Form>
  );
}
