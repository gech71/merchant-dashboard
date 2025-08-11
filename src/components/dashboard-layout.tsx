
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building,
  Home,
  Users,
  Briefcase,
  ChevronDown,
  UserCircle,
} from 'lucide-react';

import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard/companies', icon: Building, label: 'Companies' },
  { href: '/dashboard/branches', icon: Home, label: 'Branches' },
  { href: '/dashboard/merchants', icon: Briefcase, label: 'Merchants' },
  { href: '/dashboard/sales-reps', icon: Users, label: 'Sales Reps' },
];

function UserProfile() {
  const { state } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 p-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/40x40.png" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div
            className={cn(
              'flex flex-col text-left transition-opacity duration-200',
              state === 'collapsed' && 'opacity-0'
            )}
          >
            <p className="text-sm font-medium">System Admin</p>
            <p className="text-xs text-muted-foreground">
              admin@merchantview.com
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mb-2 w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarHeader className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'
                  )}
                >
                  <Briefcase className="h-6 w-6" />
                </div>
                <h1 className="text-lg font-semibold text-primary transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                  MerchantView
                </h1>
              </div>
              <SidebarTrigger />
            </SidebarHeader>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <UserProfile />
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
        </main>
      </div>
  );
}
