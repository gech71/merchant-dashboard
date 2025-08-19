
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

const systemLoginSchema = z.object({
  identifier: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

const adminLoginSchema = z.object({
  identifier: z.string().min(1, 'Account number is required.'),
  password: z.string().min(1, 'Phone number is required.'),
});

const salesLoginSchema = z.object({
  identifier: z.string().min(1, 'Phone number is required.'),
  password: z.string().optional(),
});

type SystemLoginFormValues = z.infer<typeof systemLoginSchema>;
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
type SalesLoginFormValues = z.infer<typeof salesLoginSchema>;

const LoginForm = ({
    loginType,
}: {
    loginType: 'merchantAdmin' | 'merchantSales' | 'system';
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const { setCurrentUser } = useDataContext();
    const [isLoading, setIsLoading] = React.useState(false);

    const isMerchantAdmin = loginType === 'merchantAdmin';
    const isMerchantSales = loginType === 'merchantSales';
    const isSystemLogin = loginType === 'system';
    
    let schema;
    if (isSystemLogin) schema = systemLoginSchema;
    else if (isMerchantAdmin) schema = adminLoginSchema;
    else schema = salesLoginSchema;

    const form = useForm<SystemLoginFormValues | AdminLoginFormValues | SalesLoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    async function onSubmit(data: SystemLoginFormValues | AdminLoginFormValues | SalesLoginFormValues) {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, loginType }),
            });

            const result = await response.json();

            if (response.ok && result.isSuccess) {
                setCurrentUser(result.user);
                toast({
                    title: 'Login Successful',
                    description: 'Welcome back!',
                });
                router.refresh(); // This is crucial to re-fetch server data
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {isSystemLogin && (
                    <>
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input placeholder="admin@system.com" {...field} /></FormControl>
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
                                <FormControl><Input type="password" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </>
                )}
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
                 {(isMerchantAdmin || isMerchantSales) && (
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
                 )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </Form>
    );
};


export default function LoginPage() {
    const [loginType, setLoginType] = React.useState('merchant');

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <Tabs value={loginType} onValueChange={setLoginType}>
                    <CardHeader>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="merchant">Merchant Login</TabsTrigger>
                                <TabsTrigger value="system">System Login</TabsTrigger>
                            </TabsList>
                    </CardHeader>
                    <TabsContent value="merchant">
                        <MerchantLogin />
                    </TabsContent>
                    <TabsContent value="system">
                        <CardHeader>
                            <CardTitle className="text-2xl">System Login</CardTitle>
                            <CardDescription>Enter your credentials to access the admin dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <LoginForm loginType="system" />
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}

const MerchantLogin = () => {
    const [merchantLoginType, setMerchantLoginType] = React.useState<'merchantAdmin' | 'merchantSales'>('merchantAdmin');
    
    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl">Merchant Login</CardTitle>
                <CardDescription>Select your role to sign in.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={merchantLoginType} onValueChange={(val) => setMerchantLoginType(val as 'merchantAdmin' | 'merchantSales')}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="merchantAdmin">Admin</TabsTrigger>
                        <TabsTrigger value="merchantSales">Sales</TabsTrigger>
                    </TabsList>
                    <TabsContent value="merchantAdmin" className="pt-4">
                        <LoginForm loginType="merchantAdmin" />
                    </TabsContent>
                    <TabsContent value="merchantSales" className="pt-4">
                            <LoginForm loginType="merchantSales" />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </>
    )
}
