
import BranchUserList from '@/components/branch-user-list';
import type { BranchUser } from '@/types';

const MOCK_BRANCH_USERS: BranchUser[] = [
  { id: '1', name: 'John Doe', email: 'john.d@branch.com', branch: 'Downtown Branch', status: 'Active' },
  { id: '2', name: 'Jane Smith', email: 'jane.s@branch.com', branch: 'Uptown Branch', status: 'Active' },
  { id: '3', name: 'Peter Jones', email: 'peter.j@branch.com', branch: 'Downtown Branch', status: 'Inactive' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@branch.com', branch: 'Westside Branch', status: 'Pending' },
  { id: '5', name: 'David Williams', email: 'david.w@branch.com', branch: 'Uptown Branch', status: 'Active' },
];

export default function BranchUsersPage() {
  return <BranchUserList branchUsers={MOCK_BRANCH_USERS} />;
}
