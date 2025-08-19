
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
import { stream_pay_settings } from '@/types';
import { useDataContext } from '@/context/data-context';

const formSchema = z.object({
  ADDRESS: z.string().url('Please enter a valid URL.'),
  USERNAME: z.string().min(1, 'Username is required.'),
  PASSWORD: z.string().optional(),
  IV: z.string().optional(),
  KEY: z.string().optional(),
  HV: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditStreamPaySettingForm({
  setting,
  setOpen,
}: {
  setting: stream_pay_settings;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updateStreamPaySetting } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ADDRESS: setting.ADDRESS,
      USERNAME: setting.USERNAME,
      PASSWORD: '',
      IV: '',
      KEY: '',
      HV: '',
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
        const dataToUpdate: any = { ...setting, ...data };
        if (!data.PASSWORD) delete dataToUpdate.PASSWORD;
        if (!data.IV) delete dataToUpdate.IV;
        if (!data.KEY) delete dataToUpdate.KEY;
        if (!data.HV) delete dataToUpdate.HV;


        await updateStreamPaySetting(dataToUpdate);
        toast({
            title: 'Setting Updated',
            description: 'The StreamPay setting has been successfully updated.',
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
                <Input placeholder="https://streampay.api/v1" {...field} />
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
                <Input placeholder="streamuser" {...field} />
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
                <Input type="password" placeholder="Leave blank to keep current" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="IV"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New IV</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="KEY"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Key</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="HV"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New HV</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Leave blank to keep current" {...field} />
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
