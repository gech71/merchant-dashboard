
'use client';

import { DashboardLayout as Layout } from '@/components/dashboard-layout';
import { useDataContext } from '@/context/data-context';
import { usePathname } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = useDataContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
      return;
    }
    
    if (currentUser) {
      router.push('/login');
        // const authorized = currentUser.permissions?.includes(pathname) ?? false;
        // // The root dashboard page is always allowed if the user is logged in
        // if (pathname === '/dashboard') {
        //     setIsAuthorized(true);
        // } else {
        //     setIsAuthorized(authorized);
        // }
    }
  }, [currentUser, pathname, router]);

  if (isAuthorized === null) {
    return (
        <Layout>
            <div className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </div>
        </Layout>
    );
  }

  if (!isAuthorized) {
    return (
        <Layout>
            <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                           <ShieldAlert className="h-10 w-10 text-destructive" />
                        </div>
                        <CardTitle className="mt-4 text-2xl">Access Denied</CardTitle>
                        <CardDescription>
                            You do not have permission to view this page. Please contact your administrator if you believe this is an error.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </Layout>
    );
  }

  return <Layout>{children}</Layout>;
}
