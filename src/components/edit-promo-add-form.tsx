
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

const formSchema = z.object({
  ADDTITLE: z.string().min(1, 'Title is required.'),
  ADDSUBTITLE: z.string().min(1, 'Subtitle is required.'),
  ADDADDRESS: z.string().url('Must be a valid URL.'),
  IMAGEADDRESS: z.string().url('Must be a valid URL.'),
  ORDER: z.coerce.number().int().min(0, 'Order must be a positive number.'),
});

type FormValues = z.infer<typeof formSchema>;

export function EditPromoAdForm({
  promoAd,
  setOpen,
}: {
  promoAd: promo_adds;
  setOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const { updatePromoAd } = useDataContext();
  const [isLoading, setIsLoading] = React.useState(false);

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

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      await updatePromoAd({ ...promoAd, ...data });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
  );
}
