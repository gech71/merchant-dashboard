
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataContext } from '@/context/data-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const adminLoginSchema = z.object({
  identifier: z.string().min(1, 'Account number is required.'),
  password: z.string().min(1, 'Phone number is required.'),
});

const salesLoginSchema = z.object({
  identifier: z.string().min(1, 'Phone number is required.'),
  password: z.string().optional(), // Not used for sales, but keeps form structure consistent
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
type SalesLoginFormValues = z.infer<typeof salesLoginSchema>;

const LoginForm = ({
    loginType,
    userType,
}: {
    loginType: 'merchantAdmin' | 'merchantSales' | 'branch';
    userType: 'merchant' | 'branch';
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const { setCurrentUser } = useDataContext();
    const [isLoading, setIsLoading] = React.useState(false);

    const isMerchantAdmin = loginType === 'merchantAdmin';
    const schema = isMerchantAdmin ? adminLoginSchema : salesLoginSchema;

    const form = useForm<AdminLoginFormValues | SalesLoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    async function onSubmit(data: AdminLoginFormValues | SalesLoginFormValues) {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, userType, loginType }),
            });

            const result = await response.json();

            if (response.ok && result.isSuccess) {
                setCurrentUser(result.user);
                toast({
                    title: 'Login Successful',
                    description: 'Welcome back!',
                });
                router.push('/dashboard');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Login Failed',
                    description: result.message || 'An unexpected error occurred.',
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred',
                description: 'Could not connect to the server. Please try again later.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (userType === 'branch') {
        return (
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl><Input placeholder='e.g., john.d@branch.com' {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl><Input type="password" placeholder='••••••••' {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </Form>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isMerchantAdmin && (
                     <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl><Input placeholder="e.g., ACC001" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
                 <FormField
                    control={form.control}
                    name={isMerchantAdmin ? 'password' : 'identifier'}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl><Input placeholder="e.g., 111-222-3333" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </Form>
    );
};


export default function LoginPage() {
    const [userType, setUserType] = React.useState<'merchant' | 'branch'>('merchant');
    const [merchantLoginType, setMerchantLoginType] = React.useState<'merchantAdmin' | 'merchantSales'>('merchantAdmin');

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Tabs value={userType} onValueChange={(val) => setUserType(val as 'merchant' | 'branch')} className="w-full max-w-sm">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>Select your user type to sign in.</CardDescription>
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="merchant">Merchant User</TabsTrigger>
                            <TabsTrigger value="branch">Branch/System User</TabsTrigger>
                        </TabsList>
                    </CardHeader>
                    <CardContent>
                        <TabsContent value="merchant">
                            <Tabs value={merchantLoginType} onValueChange={(val) => setMerchantLoginType(val as 'merchantAdmin' | 'merchantSales')}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="merchantAdmin">Admin</TabsTrigger>
                                    <TabsTrigger value="merchantSales">Sales</TabsTrigger>
                                </TabsList>
                                <TabsContent value="merchantAdmin" className="pt-4">
                                    <LoginForm loginType="merchantAdmin" userType="merchant" />
                                </TabsContent>
                                <TabsContent value="merchantSales" className="pt-4">
                                     <LoginForm loginType="merchantSales" userType="merchant" />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                         <TabsContent value="branch">
                           <LoginForm loginType="branch" userType="branch" />
                        </TabsContent>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}
