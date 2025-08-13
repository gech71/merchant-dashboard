
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
  roleId: z.string({ required_error: 'Please select a role.' }),
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
  const { roles, merchants, updateUserRole } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantFormSchema),
    defaultValues: {
      roleId: merchantUser.roleId || '',
    },
  });

  async function onSubmit(data: MerchantFormValues) {
    setIsLoading(true);
    const selectedRole = roles.find(r => r.id === data.roleId);

    if (selectedRole?.name === 'Merchant Admin') {
      const adminExists = merchants.some(
        (m) => m.ID !== merchantUser.ID && m.ACCOUNTNUMBER === merchantUser.ACCOUNTNUMBER && m.role?.name === 'Merchant Admin'
      );
      if (adminExists) {
        form.setError('roleId', {
          type: 'manual',
          message: `An Admin user already exists for this company. You can't have more than one.`,
        });
        setIsLoading(false);
        return;
      }
    }

    try {
        await updateUserRole(merchantUser.ID, data.roleId, 'merchant');
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
            <FormLabel>FULLNAME</FormLabel>
            <FormControl>
                <Input placeholder="John Doe" value={merchantUser.FULLNAME} disabled />
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
          name="roleId"
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
                  {roles.filter(r => r.name.startsWith('Merchant')).map(role => (
                    <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
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
                <Input placeholder="user@company.com" value={merchantUser.PHONENUMBER} disabled/>
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
