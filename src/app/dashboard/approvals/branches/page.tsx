
'use client'
import BranchList from '@/components/branch-list';
import { useDataContext } from '@/context/data-context';


export default function BranchesApprovalPage() {
  const { branches } = useDataContext();
  const pendingBranches = branches.filter(b => b.status === 'Pending');
  return <BranchList branches={pendingBranches} approvalView={true}/>;
}
