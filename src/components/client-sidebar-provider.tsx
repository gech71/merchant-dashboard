'use client';

import * as React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';

export function ClientSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <SidebarProvider>{children}</SidebarProvider>;
}
