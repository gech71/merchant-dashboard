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
import { ussd_push_settings } from '@/types';
import { useDataContext } from '@/context/data-context';

const formSchema = z.object({
  ADDRESS: z.string().url('Please enter a valid URL.'),
  RESULTURL: z.string().url('Please enter a valid URL.'),
  USERNAME: z.string().min(1, 'Username is required.'),
  PASSWORD: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditUssdPushSettingForm({
  setting,
  setOpen,
}: {
  setting: ussd_push_settings;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updateUssdPushSetting } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ADDRESS: setting.ADDRESS,
      RESULTURL: setting.RESULTURL,
      USERNAME: setting.USERNAME,
      PASSWORD: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
        const dataToUpdate: any = { ...setting, ...data };
        if (!data.PASSWORD) {
            delete dataToUpdate.PASSWORD;
        }

        await updateUssdPushSetting(dataToUpdate);
        toast({
            title: 'Setting Updated',
            description: 'The USSD Push setting has been successfully updated.',
        });
        setOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Failed to Update Setting',
            description: 'An error occurred while trying to update the setting.',
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
          name="ADDRESS"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="https://ussd.gateway.com/push" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="RESULTURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Result URL</FormLabel>
              <FormControl>
                <Input placeholder="https://api.myapp.com/ussd/callback" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="USERNAME"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="ussd_user" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="PASSWORD"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
