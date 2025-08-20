
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
import { controllersconfigs } from '@/types';
import { useDataContext } from '@/context/data-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const formSchema = z.object({
  APIKEY: z.string().min(1, 'API Key is required.'),
});

type FormValues = z.infer<typeof formSchema>;
type Change = { field: string; before: any; after: any };

export function EditControllersConfigForm({
  config,
  setOpen,
}: {
  config: controllersconfigs;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updateControllersConfig } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [changes, setChanges] = React.useState<Change[]>([]);
  const [formData, setFormData] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      APIKEY: config.APIKEY,
    },
  });

  const getChanges = (data: FormValues): Change[] => {
    const changes: Change[] = [];
    if (data.APIKEY !== config.APIKEY) {
      changes.push({ field: 'API Key', before: config.APIKEY, after: data.APIKEY });
    }
    return changes;
  }

  function onFormSubmit(data: FormValues) {
    const detectedChanges = getChanges(data);
    if (detectedChanges.length === 0) {
      toast({
        title: "No Changes Detected",
        description: "You haven't made any changes.",
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
        await updateControllersConfig({ ...config, ...formData });
        toast({
            title: 'Configuration Updated',
            description: 'The controller configuration has been successfully updated.',
        });
        setOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Failed to Update Configuration',
            description: 'An error occurred while trying to update the configuration.',
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
          <FormItem>
            <FormLabel>Controller Key</FormLabel>
            <FormControl>
                <Input value={config.CONTROLLERKEY} disabled />
            </FormControl>
          </FormItem>
          <FormField
            control={form.control}
            name="APIKEY"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input placeholder="API_KEY_001_XYZ" {...field} />
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
