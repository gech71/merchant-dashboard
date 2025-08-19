
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const formSchema = z.object({
  ADDRESS: z.string().url('Please enter a valid URL.'),
  USERNAME: z.string().min(1, 'Username is required.'),
  PASSWORD: z.string().optional(),
  IV: z.string().optional(),
  KEY: z.string().optional(),
  HV: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type Change = { field: string; before: any; after: any };

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
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [changes, setChanges] = React.useState<Change[]>([]);
  const [formData, setFormData] = React.useState<FormValues | null>(null);

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

  const getChanges = (data: FormValues): Change[] => {
    const changes: Change[] = [];
    if (data.ADDRESS !== setting.ADDRESS) {
      changes.push({ field: 'Address', before: setting.ADDRESS, after: data.ADDRESS });
    }
    if (data.USERNAME !== setting.USERNAME) {
      changes.push({ field: 'Username', before: setting.USERNAME, after: data.USERNAME });
    }
    if (data.PASSWORD) {
      changes.push({ field: 'Password', before: '********', after: '********' });
    }
    if (data.IV) {
      changes.push({ field: 'IV', before: '********', after: '********' });
    }
    if (data.KEY) {
      changes.push({ field: 'Key', before: '********', after: '********' });
    }
    if (data.HV) {
      changes.push({ field: 'HV', before: '********', after: '********' });
    }
    return changes;
  }

  function onFormSubmit(data: FormValues) {
    const detectedChanges = getChanges(data);
    if (detectedChanges.length === 0) {
      toast({
        title: "No Changes Detected",
        description: "You haven't made any changes to the settings.",
      });
      return;
    }
    setChanges(detectedChanges);
    setFormData(data);
    setIsConfirmOpen(true);
  }

  async function handleConfirmUpdate() {
    if (!formData) return;
    setIsLoading(true);
    setIsConfirmOpen(false);

    try {
        const dataToUpdate: any = { ...setting, ...formData };
        if (!formData.PASSWORD) delete dataToUpdate.PASSWORD;
        if (!formData.IV) delete dataToUpdate.IV;
        if (!formData.KEY) delete dataToUpdate.KEY;
        if (!formData.HV) delete dataToUpdate.HV;


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
        setFormData(null);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Changes</AlertDialogTitle>
            <AlertDialogDescription>
              Please review your changes below. Do you want to apply these updates?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Field</TableHead>
                        <TableHead>Before</TableHead>
                        <TableHead>After</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {changes.map(change => (
                        <TableRow key={change.field}>
                            <TableCell className="font-medium">{change.field}</TableCell>
                            <TableCell>{change.before}</TableCell>
                            <TableCell className="text-primary">{change.after}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
