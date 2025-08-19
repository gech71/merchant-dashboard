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
import { role_capablities } from '@/types';
import { useDataContext } from '@/context/data-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from './ui/checkbox';

const editRoleCapabilitySchema = z.object({
  ROLEID: z.string().uuid(),
  MENUNAME: z.string().min(1, 'Menu name is required'),
  MENUNAME_am: z.string().optional(),
  ADDRESS: z.string().optional(),
  MENUORDER: z.coerce.number().int().optional(),
  SUBMENUORDER: z.coerce.number().int().optional(),
  PARENT: z.boolean().optional(),
  PARENTID: z.string().uuid().optional().nullable(),
});

type EditRoleCapabilityFormValues = z.infer<typeof editRoleCapabilitySchema>;

export function EditRoleCapabilityForm({
  capability,
  setOpen,
}: {
  capability: role_capablities;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { roles, updateRoleCapability } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<EditRoleCapabilityFormValues>({
    resolver: zodResolver(editRoleCapabilitySchema),
    defaultValues: {
      ROLEID: capability.ROLEID,
      MENUNAME: capability.MENUNAME || '',
      MENUNAME_am: capability.MENUNAME_am || '',
      ADDRESS: capability.ADDRESS || '',
      MENUORDER: capability.MENUORDER || 0,
      SUBMENUORDER: capability.SUBMENUORDER || 0,
      PARENT: capability.PARENT || false,
      PARENTID: capability.PARENTID || null,
    },
  });

  async function onSubmit(data: EditRoleCapabilityFormValues) {
    setIsLoading(true);
    try {
      await updateRoleCapability({
        ...capability,
        ...data,
      });
      toast({
        title: 'Capability Updated',
        description: 'The role capability has been successfully updated.',
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update the role capability.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="MENUNAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Dashboard" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="MENUNAME_am"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Name (Amharic)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., ዳሽቦርድ" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="ROLEID"
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
                      {roles.map((role) => (
                        <SelectItem key={role.ID} value={role.ID}>
                          {role.ROLENAME}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ADDRESS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., /dashboard/users" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="MENUORDER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="SUBMENUORDER"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub-Menu Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="PARENT"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-8">
                  <div className="space-y-0.5">
                    <FormLabel>Is Parent Menu?</FormLabel>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
