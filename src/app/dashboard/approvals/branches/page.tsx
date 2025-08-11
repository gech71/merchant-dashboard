
import BranchList from '@/components/branch-list';
import type { Branch } from '@/types';

const MOCK_BRANCHES: Branch[] = [
  { id: '1', name: 'Downtown Branch', code: 'DT001', address: '123 Main St, Anytown, USA', contact: '555-1234', status: 'Approved' },
  { id: '2', name: 'Uptown Branch', code: 'UP002', address: '456 Oak Ave, Anytown, USA', contact: '555-5678', status: 'Pending' },
  { id: '3', name: 'Westside Branch', code: 'WS003', address: '789 Pine Rd, Anytown, USA', contact: '555-9012', status: 'Approved' },
  { id: '4', name: 'Eastside Branch', code: 'ES004', address: '101 Maple Blvd, Anytown, USA', contact: '555-3456', status: 'Approved' },
  { id: '5', name: 'South Branch', code: 'SB005', address: '212 Birch Ln, Anytown, USA', contact: '555-7890', status: 'Rejected' },
];

export default function BranchesApprovalPage() {
  const pendingBranches = MOCK_BRANCHES.filter(b => b.status === 'Pending');
  return <BranchList branches={pendingBranches} approvalView={true}/>;
}
