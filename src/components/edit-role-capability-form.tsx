
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

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
type Change = { field: string; before: any; after: any };

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
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [changes, setChanges] = React.useState<Change[]>([]);
  const [formData, setFormData] = React.useState<EditRoleCapabilityFormValues | null>(null);

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

  const getRoleName = (roleId: string) => roles.find(r => r.ID === roleId)?.ROLENAME || roleId;

  const getChanges = (data: EditRoleCapabilityFormValues): Change[] => {
    const changes: Change[] = [];
    if (data.ROLEID !== capability.ROLEID) {
      changes.push({ field: 'Role', before: getRoleName(capability.ROLEID), after: getRoleName(data.ROLEID) });
    }
    if (data.MENUNAME !== capability.MENUNAME) {
      changes.push({ field: 'Menu Name', before: capability.MENUNAME, after: data.MENUNAME });
    }
     if (data.MENUNAME_am !== capability.MENUNAME_am) {
      changes.push({ field: 'Menu Name (Amharic)', before: capability.MENUNAME_am, after: data.MENUNAME_am });
    }
    if (data.ADDRESS !== capability.ADDRESS) {
      changes.push({ field: 'Address', before: capability.ADDRESS, after: data.ADDRESS });
    }
     if (data.MENUORDER !== capability.MENUORDER) {
      changes.push({ field: 'Menu Order', before: capability.MENUORDER, after: data.MENUORDER });
    }
    if (data.SUBMENUORDER !== capability.SUBMENUORDER) {
      changes.push({ field: 'Sub-Menu Order', before: capability.SUBMENUORDER, after: data.SUBMENUORDER });
    }
    if (data.PARENT !== capability.PARENT) {
      changes.push({ field: 'Is Parent', before: capability.PARENT ? 'Yes' : 'No', after: data.PARENT ? 'Yes' : 'No' });
    }
    return changes;
  }
  
  function onFormSubmit(data: EditRoleCapabilityFormValues) {
    const detectedChanges = getChanges(data);
    if(detectedChanges.length === 0) {
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
      await updateRoleCapability({
        ...capability,
        ...formData,
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
      setFormData(null);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
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
                                <TableCell>{String(change.before)}</TableCell>
                                <TableCell className="text-primary">{String(change.after)}</TableCell>
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
