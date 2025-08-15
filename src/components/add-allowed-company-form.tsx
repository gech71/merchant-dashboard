
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
  ACCOUNTNUMBER: z.string().min(4, 'Account number must be at least 4 characters.'),
  FIELDNAME: z.string().min(2, 'Field name must be generated.'),
});

type AllowedCompanyFormValues = z.infer<typeof allowedCompanyFormSchema>;


export function AddAllowedCompanyForm({ 
  setOpen, 
}: { 
  setOpen: (open: boolean) => void,
}) {
  const { toast } = useToast();
  const { addAllowedCompany, allowedCompanies } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldNameIsSet, setFieldNameIsSet] = React.useState(false);

  const form = useForm<AllowedCompanyFormValues>({
    resolver: zodResolver(allowedCompanyFormSchema),
    defaultValues: {
      FIELDNAME: '',
      ACCOUNTNUMBER: '',
    },
  });

  const handleGenerateName = () => {
    const accountNumber = form.getValues('ACCOUNTNUMBER');
    // Trigger validation for ACCOUNTNUMBER field
    form.trigger('ACCOUNTNUMBER');
    
    // Check if the account number field has errors
    if (form.formState.errors.ACCOUNTNUMBER) {
        form.setValue('FIELDNAME', '');
        setFieldNameIsSet(false);
        return;
    }
    
    const alreadyExists = allowedCompanies.some(c => c.ACCOUNTNUMBER === accountNumber);
    if (alreadyExists) {
        form.setError('ACCOUNTNUMBER', {
            type: 'manual',
            message: 'Company with this account number already exists.',
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
    
    const alreadyExists = allowedCompanies.some(c => c.ACCOUNTNUMBER === data.ACCOUNTNUMBER);
    if (alreadyExists) {
        form.setError('ACCOUNTNUMBER', {
            type: 'manual',
            message: 'Company with this account number already exists.',
        });
        setIsLoading(false);
        return;
    }

    try {
        await addAllowedCompany(data);
        toast({
          title: 'Company Submitted for Approval',
          description: `${data.FIELDNAME} has been sent for verification.`,
        });
        setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to Add Company',
            description: 'An error occurred while trying to add the company.',
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
            <Button type="submit" disabled={isLoading || !fieldNameIsSet}>{isLoading ? 'Adding...' : 'Add Company'}</Button>
        </div>
      </form>
    </Form>
  );
}
