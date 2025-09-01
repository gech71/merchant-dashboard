
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

const merchantLoginSchema = z.object({
  identifier: z.string().min(1, 'Account number is required.'),
  password: z.string().min(1, 'Phone number is required.'),
});

type SystemLoginFormValues = z.infer<typeof systemLoginSchema>;
type MerchantLoginFormValues = z.infer<typeof merchantLoginSchema>;

const LoginForm = ({
    loginType,
}: {
    loginType: 'merchant' | 'system';
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const { setCurrentUser } = useDataContext();
    const [isLoading, setIsLoading] = React.useState(false);

    const isSystemLogin = loginType === 'system';
    
    const schema = isSystemLogin ? systemLoginSchema : merchantLoginSchema;

    const form = useForm<SystemLoginFormValues | MerchantLoginFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    async function onSubmit(data: SystemLoginFormValues | MerchantLoginFormValues) {
        setIsLoading(true);
        const apiLoginType = isSystemLogin ? 'system' : 'merchantAdmin'; // merchantAdmin covers both Admin and Sales logic on the backend
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, loginType: apiLoginType }),
            });

            const result = await response.json();

            if (response.ok && result.isSuccess) {
                setCurrentUser(result.user);
                toast({
                    title: 'Login Successful',
                    description: 'Welcome back!',
                });
                router.refresh();
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
                {isSystemLogin ? (
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
                ) : (
                     <>
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl><Input placeholder="e.g., 111-222-3333" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </>
                )}
                <p className="text-xs text-muted-foreground">
                    For the 'Sales' role, please enter your assigned phone number in both fields.
                </p>
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </Form>
    );
};


export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Card className="w-full max-w-md">
                <Tabs defaultValue="merchant" className="w-full">
                    <CardHeader>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="merchant">Merchant Login</TabsTrigger>
                                <TabsTrigger value="system">System Login</TabsTrigger>
                            </TabsList>
                    </CardHeader>
                    <TabsContent value="merchant">
                        <CardHeader>
                            <CardTitle className="text-2xl">Merchant Login</CardTitle>
                            <CardDescription>Enter your credentials to sign in.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <LoginForm loginType="merchant" />
                        </CardContent>
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
