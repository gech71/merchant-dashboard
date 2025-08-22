
'use client';
import SystemUserList from '@/components/system-user-list';
import { useDataContext } from '@/context/data-context';

export default function SystemUsersPage() {
  const { systemUsers } = useDataContext();
  return <SystemUserList systemUsers={systemUsers} />;
}
