
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
import { Merchant_users } from '@/types';
import { useDataContext } from '@/context/data-context';

const merchantFormSchema = z.object({
  ROLE: z.string({ required_error: 'Please select a role.' }),
});

type MerchantFormValues = z.infer<typeof merchantFormSchema>;


export function EditMerchantForm({
  merchantUser,
  setOpen,
}: {
  merchantUser: Merchant_users;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { roles, updateMerchant } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      ROLE: merchantUser.ROLE || '',
    },
  });

  async function onSubmit(data: MerchantFormValues) {
    setIsLoading(true);

    try {
        await updateMerchant({ ...merchantUser, ROLE: data.ROLE });
        toast({
            title: 'Merchant User Updated',
            description: `${merchantUser.FULLNAME}'s role has been successfully updated.`,
        });
        setOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to Update Merchant',
            description: 'An error occurred while trying to update the merchant.',
        });
    } finally {
        setIsLoading(false);
    }
  }

  const merchantRoles = React.useMemo(() => {
    return roles.filter(r => r.ROLENAME === 'Admin' || r.ROLENAME === 'Saler');
  }, [roles]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
            <FormLabel>FULLNAME</FormLabel>
            <FormControl>
                <Input placeholder="John Doe" value={merchantUser.FULLNAME ?? ""} disabled />
            </FormControl>
        </FormItem>
        
        <FormItem>
            <FormLabel>ACCOUNTNUMBER</FormLabel>
            <FormControl>
                 <Input placeholder="ACC12345" value={merchantUser.ACCOUNTNUMBER} disabled />
            </FormControl>
        </FormItem>

        <FormField
          control={form.control}
          name="ROLE"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ROLE</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {merchantRoles.map(role => (
                    <SelectItem key={role.ID} value={role.ROLENAME}>{role.ROLENAME}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
            <FormLabel>PHONENUMBER</FormLabel>
            <FormControl>
                <Input placeholder="user@company.com" value={merchantUser.PHONENUMBER ?? ""} disabled/>
            </FormControl>
        </FormItem>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </Form>
  );
}
