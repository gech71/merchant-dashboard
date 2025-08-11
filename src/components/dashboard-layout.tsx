
'use client';

import * as React from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <main className="flex-1 p-4 sm:px-6 sm:py-6 md:gap-8">
        {children}
      </main>
    </div>
  );
}
