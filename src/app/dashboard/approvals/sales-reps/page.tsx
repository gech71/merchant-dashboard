
import SalesRepList from '@/components/sales-rep-list';
import type { SalesRep } from '@/types';

const MOCK_SALES_REPS: SalesRep[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice.j@example.com', company: 'Innovate Inc.', status: 'Active' },
  { id: '2', name: 'Bob Williams', email: 'bob.w@example.com', company: 'Apex Solutions', status: 'Active' },
  { id: '3', name: 'Charlie Brown', email: 'charlie.b@example.com', company: 'Quantum Corp', status: 'Inactive' },
  { id: '4', name: 'Diana Prince', email: 'diana.p@example.com', company: 'Synergy Systems', status: 'Pending' },
  { id: '5', name: 'Ethan Hunt', email: 'ethan.h@example.com', company: 'Pioneer Ltd.', status: 'Active' },
];

export default function SalesRepsApprovalPage() {
  const pendingSalesReps = MOCK_SALES_REPS.filter(r => r.status === 'Pending');
  return <SalesRepList salesReps={pendingSalesReps} approvalView={true} />;
}
