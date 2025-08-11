
'use client'
import BranchUserList from '@/components/branch-user-list';
import { useDataContext } from '@/context/data-context';

export default function BranchUsersPage() {
  const { branchUsers } = useDataContext();
  return <BranchUserList branchUsers={branchUsers} />;
}
