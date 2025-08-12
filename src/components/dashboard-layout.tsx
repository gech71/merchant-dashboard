
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
  CheckSquare,
  UserCog,
  LayoutGrid
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
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
import { cn } from '@/lib/utils';
import { useDataContext } from '@/context/data-context';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/dashboard/allowed_companies', icon: Building, label: 'Allowed Companies' },
  { href: '/dashboard/branches', icon: Home, label: 'Branches' },
  { href: '/dashboard/branch-users', icon: UserCog, label: 'Branch Users' },
  { href: '/dashboard/merchant_users', icon: Briefcase, label: 'Merchant Users' },
];

const APPROVAL_NAV_ITEMS = [
  { href: '/dashboard/approvals/allowed_companies', icon: Building, label: 'Allowed Companies' },
]

function UserProfile() {
  const { currentUser } = useDataContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className='w-full justify-start gap-2 p-2 text-left'
        >
          <div
            className={cn(
                'flex flex-col text-left transition-opacity duration-200'
            )}
          >
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">
              {currentUser.email}
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
  const { state } = useSidebar();

  return (
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent className="flex flex-col justify-between">
            <div>
              <SidebarHeader className="flex items-center justify-between p-4 text-left">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground'
                    )}
                  >
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <h1 className={cn("text-lg font-semibold text-primary transition-opacity duration-200")}>
                    MerchantView
                  </h1>
                </div>
              </SidebarHeader>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="justify-start text-left"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center gap-2">
                  <CheckSquare />
                  <span>Approvals</span>
                </SidebarGroupLabel>
                <SidebarMenu>
                  {APPROVAL_NAV_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="justify-start text-left"
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>

            </div>
            <SidebarFooter>
              <UserProfile />
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
        </main>
      </div>
  );
}
