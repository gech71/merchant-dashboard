
import MerchantList from '@/components/merchant-list';
import type { Merchant } from '@/types';

const MOCK_MERCHANTS: Merchant[] = [
  { id: '3', name: 'Gadget Hub Admin', company: 'Quantum Corp', email: 'sales@gadgethub.com', role: 'Admin', status: 'Pending' },
  { id: '6', name: 'Diana Prince', company: 'Synergy Systems', email: 'diana.p@example.com', role: 'Sales', status: 'Pending' },
];

export default function MerchantsApprovalPage() {
  const pendingMerchants = MOCK_MERCHANTS.filter(m => m.status === 'Pending');
  return <MerchantList merchants={pendingMerchants} approvalView={true}/>;
}
