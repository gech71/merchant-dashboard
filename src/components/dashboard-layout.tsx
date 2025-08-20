
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building,
  Users,
  Briefcase,
  LayoutGrid,
  DollarSign,
  Receipt,
  Send,
  Link2,
  KeyRound,
  Settings,
  Repeat,
  Smartphone,
  QrCode,
  ShieldCheck,
  Settings2,
  FileText,
  Megaphone,
  LogOut,
  UserCog,
  Shield,
  History,
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
import { useToast } from '@/hooks/use-toast';

const ALL_NAV_ITEMS = [
  { group: 'Management', href: '/dashboard/allowed_companies', icon: Building, label: 'Allowed Companies' },
  { group: 'Management', href: '/dashboard/merchant_users', icon: Users, label: 'Merchant Users' },
  { group: 'Management', href: '/dashboard/account-infos', icon: FileText, label: 'Account Infos' },
  { group: 'Management', href: '/dashboard/promo-adds', icon: Megaphone, label: 'Promo Ads' },
  { group: 'Transactions', href: '/dashboard/daily-balances', icon: DollarSign, label: 'Daily Balances' },
  { group: 'Transactions', href: '/dashboard/merchant-txns', icon: Receipt, label: 'Merchant Transactions' },
  { group: 'Transactions', href: '/dashboard/arif-requests', icon: Send, label: 'Arif Requests' },
  { group: 'Transactions', href: '/dashboard/paystream-txns', icon: Repeat, label: 'PayStream Transactions' },
  { group: 'System Settings', href: '/dashboard/arifpay-endpoints', icon: Link2, label: 'ArifPay Endpoints' },
  { group: 'System Settings', href: '/dashboard/controllers-configs', icon: KeyRound, label: 'Controller Configs' },
  { group: 'System Settings', href: '/dashboard/core-integration-settings', icon: Settings, label: 'Core Integration Settings' },
  { group: 'System Settings', href: '/dashboard/stream-pay-settings', icon: Settings, label: 'StreamPay Settings' },
  { group: 'System Settings', href: '/dashboard/ussd-push-settings', icon: Smartphone, label: 'USSD Push Settings' },
  { group: 'System Settings', href: '/dashboard/role-capabilities', icon: Shield, label: 'Legacy Role Capabilities' },
  { group: 'Approvals', href: '/dashboard/approvals/allowed_companies', icon: Building, label: 'Allowed Companies' },
  { group: 'Administration', href: '/dashboard/role-management', icon: UserCog, label: 'Role Management' },
  { group: 'Administration', href: '/dashboard/audit-log', icon: History, label: 'Audit Log' },
];

const NAV_GROUPS = [
    { label: 'Management', icon: Briefcase },
    { label: 'Transactions', icon: Receipt },
    { label: 'Approvals', icon: ShieldCheck },
    { label: 'System Settings', icon: Settings2 },
    { label: 'Administration', icon: UserCog },
];


function UserProfile() {
  const { currentUser, setCurrentUser } = useDataContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' });
    if (response.ok) {
        setCurrentUser(null);
        router.push('/login');
        toast({
            title: 'Logged Out',
            description: 'You have been successfully logged out.',
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Logout Failed',
            description: 'Could not log you out. Please try again.',
        });
    }
  };
  
  if (!currentUser) {
    return null;
  }

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
        <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useDataContext();

  const hasPermission = (href: string) => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions.includes(href);
  };
  
  const NavGroup = ({ label, icon, items }: { label: string, icon: React.ElementType, items: { href: string, icon: React.ElementType, label: string }[] }) => {
    const visibleItems = items.filter(item => hasPermission(item.href));
    if (visibleItems.length === 0) return null;

     return (
     <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
            {React.createElement(icon, { className: 'h-4 w-4' })}
            <span>{label}</span>
        </SidebarGroupLabel>
        <SidebarMenu>
          {visibleItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              className="justify-start text-left pl-6"
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
    )
  }

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
                    {hasPermission('/dashboard') && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/dashboard'} className="justify-start text-left">
                                <Link href="/dashboard">
                                    <LayoutGrid />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>

              <SidebarSeparator />
              
              {NAV_GROUPS.map(group => (
                  <NavGroup 
                    key={group.label}
                    label={group.label} 
                    icon={group.icon} 
                    items={ALL_NAV_ITEMS.filter(item => item.group === group.label)} 
                  />
              ))}

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
