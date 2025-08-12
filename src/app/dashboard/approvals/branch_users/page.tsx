
'use client'
import BranchUserList from '@/components/branch-user-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type BranchUserWithRelations = Prisma.BranchUserGetPayload<{
  include: {}
}>

export default function BranchUsersApprovalPage() {
  const { branchUsers } = useDataContext();
  return <BranchUserList branchUsers={branchUsers as unknown as BranchUserWithRelations[]} approvalView={true} />;
}
