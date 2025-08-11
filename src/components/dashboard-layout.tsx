
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Briefcase,
  Users,
  User,
  PanelLeft,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const menuItems = [
  { href: '/dashboard/companies', label: 'Companies', icon: Briefcase },
  { href: '/dashboard/branches', label: 'Branches', icon: Building2 },
  { href: '/dashboard/merchants', label: 'Merchants', icon: Users },
  { href: '/dashboard/sales-reps', label: 'Sales Reps', icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-semibold text-lg">MerchantView</span>
              <div className="ml-auto">
                <SidebarTrigger />
              </div>
            </div>
          </SidebarHeader>

          <SidebarMenu className="flex-1">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          </SidebarMenu>
          <SidebarSeparator />
           <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start gap-2 w-full p-2 h-auto">
                   <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/32x32.png" alt="System Admin" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">System Admin</p>
                    <p className="text-xs text-muted-foreground">admin@merchantview.com</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-4 sm:px-6 sm:py-6 md:gap-8 sm:pl-16">
        {children}
      </main>
    </div>
  );
}
