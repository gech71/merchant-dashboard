
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { promo_adds } from '@/types';
import { useDataContext } from '@/context/data-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const formSchema = z.object({
  ADDTITLE: z.string().min(1, 'Title is required.'),
  ADDSUBTITLE: z.string().min(1, 'Subtitle is required.'),
  ADDADDRESS: z.string().url('Must be a valid URL.'),
  IMAGEADDRESS: z.string().url('Must be a valid URL.'),
  ORDER: z.coerce.number().int().min(0, 'Order must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;
type Change = { field: string; before: any; after: any };

export function EditPromoAdForm({
  promoAd,
  setOpen,
}: {
  promoAd: promo_adds;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { promoAdds, updatePromoAd } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [changes, setChanges] = React.useState<Change[]>([]);
  const [formData, setFormData] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ADDTITLE: promoAd.ADDTITLE,
        ADDSUBTITLE: promoAd.ADDSUBTITLE,
        ADDADDRESS: promoAd.ADDADDRESS,
        IMAGEADDRESS: promoAd.IMAGEADDRESS,
        ORDER: promoAd.ORDER,
    },
  });

  const getChanges = (data: FormValues): Change[] => {
    const changes: Change[] = [];
    const fields: (keyof FormValues)[] = [ 'ADDTITLE', 'ADDSUBTITLE', 'ADDADDRESS', 'IMAGEADDRESS', 'ORDER' ];
    fields.forEach(field => {
        const originalValue = promoAd[field];
        const newValue = data[field];
        if (String(originalValue) !== String(newValue)) {
            changes.push({ field, before: String(originalValue), after: String(newValue) });
        }
    });
    return changes;
  };

  async function onFormSubmit(data: FormValues) {
    const isOrderTaken = promoAdds.some(ad => ad.ORDER === data.ORDER && ad.ID !== promoAd.ID);
    if (isOrderTaken) {
        form.setError('ORDER', {
            type: 'manual',
            message: 'This display order is already taken by another ad.'
        });
        return;
    }

    const detectedChanges = getChanges(data);
    if (detectedChanges.length === 0) {
      toast({ title: 'No Changes', description: 'You have not made any changes.' });
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
      await updatePromoAd({ ...promoAd, ...formData });
      toast({
        title: 'Ad Updated',
        description: 'The promotional ad has been successfully updated.',
      });
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Update Ad',
        description: 'An error occurred while trying to update the ad.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="ADDTITLE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ADDSUBTITLE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ADDADDRESS"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Link URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="IMAGEADDRESS"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
