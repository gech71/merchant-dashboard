
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
import { arifpay_endpoints } from '@/types';
import { useDataContext } from '@/context/data-context';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';


const formSchema = z.object({
  BANK: z.string().min(1, 'Bank name is required.'),
  DISPLAYNAME: z.string().min(1, 'Display name is required.'),
  OTPLENGTH: z.coerce.number().int().min(0, 'OTP length must be a positive number.'),
  ORDER: z.coerce.number().int().min(0, 'Order must be a positive number.'),
  ENDPOINT1: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  ENDPOINT2: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  ENDPOINT3: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  CANCELURL: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  ERRORURL: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  SUCCESSURL: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  NOTIFYURL: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  IMAGEURL: z.string().url('Must be a valid URL.').optional().or(z.literal('')),
  ISTWOSTEP: z.boolean(),
  ISOTP: z.boolean(),
  TRANSACTIONTYPE: z.string().min(1, 'Transaction type is required.'),
  BENEFICIARYACCOUNT: z.string().min(1, 'Beneficiary account is required.'),
  BENEFICIARYBANK: z.string().min(1, 'Beneficiary bank is required.'),
});

type FormValues = z.infer<typeof formSchema>;
type Change = { field: string; before: any; after: any };

export function EditArifpayEndpointForm({
  endpoint,
  setOpen,
}: {
  endpoint: arifpay_endpoints;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updateArifpayEndpoint } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [changes, setChanges] = React.useState<Change[]>([]);
  const [formData, setFormData] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...endpoint,
      ENDPOINT1: endpoint.ENDPOINT1 ?? '',
      ENDPOINT2: endpoint.ENDPOINT2 ?? '',
      ENDPOINT3: endpoint.ENDPOINT3 ?? '',
      CANCELURL: endpoint.CANCELURL ?? '',
      ERRORURL: endpoint.ERRORURL ?? '',
      SUCCESSURL: endpoint.SUCCESSURL ?? '',
      NOTIFYURL: endpoint.NOTIFYURL ?? '',
      IMAGEURL: endpoint.IMAGEURL ?? '',
    },
  });

  const getChanges = (data: FormValues): Change[] => {
    const changes: Change[] = [];
    const fields: (keyof FormValues)[] = [
        'BANK', 'DISPLAYNAME', 'OTPLENGTH', 'ORDER', 'ENDPOINT1', 'ENDPOINT2', 'ENDPOINT3',
        'CANCELURL', 'ERRORURL', 'SUCCESSURL', 'NOTIFYURL', 'IMAGEURL', 'ISTWOSTEP', 'ISOTP',
        'TRANSACTIONTYPE', 'BENEFICIARYACCOUNT', 'BENEFICIARYBANK'
    ];

    fields.forEach(field => {
        const originalValue = endpoint[field] ?? '';
        const newValue = data[field] ?? '';
        if (String(originalValue) !== String(newValue)) {
            changes.push({ field, before: String(originalValue), after: String(newValue) });
        }
    });

    return changes;
  };
  
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
      await updateArifpayEndpoint({ ...endpoint, ...formData });
      toast({
        title: 'Endpoint Updated',
        description: 'The ArifPay endpoint has been successfully updated.',
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Update Endpoint',
        description: 'An error occurred while trying to update the endpoint.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="BANK"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="DISPLAYNAME"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="ORDER"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="OTPLENGTH"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OTP Length</FormLabel>
                <FormControl><Input type="number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="TRANSACTIONTYPE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="C2B">C2B</SelectItem>
                        <SelectItem value="B2B">B2B</SelectItem>
                        <SelectItem value="B2C">B2C</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="BENEFICIARYBANK"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary Bank</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="BENEFICIARYACCOUNT"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary Account</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ISTWOSTEP"
            render={({ field }) => (
              <FormItem className="flex flex-col rounded-lg border p-3 justify-center">
                <FormLabel>Two-Step</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ISOTP"
            render={({ field }) => (
              <FormItem className="flex flex-col rounded-lg border p-3 justify-center">
                <FormLabel>OTP</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ENDPOINT1"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Endpoint 1</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="SUCCESSURL"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Success URL</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="ERRORURL"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Error URL</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="CANCELURL"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Cancel URL</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="NOTIFYURL"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Notify URL</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="IMAGEURL"
            render={({ field }) => (
              <FormItem className="lg:col-span-3">
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-background/95 py-3">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
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
