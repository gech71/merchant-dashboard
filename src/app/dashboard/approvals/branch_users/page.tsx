
'use client'
import SystemUserList from '@/components/system-user-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type SystemUserWithRelations = Prisma.SystemUserGetPayload<{
  include: {}
}>

export default function SystemUsersApprovalPage() {
  const { systemUsers } = useDataContext();
  return <SystemUserList systemUsers={systemUsers as unknown as SystemUserWithRelations[]} approvalView={true} />;
}
