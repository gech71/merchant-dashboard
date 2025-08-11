
'use client'
import MerchantList from '@/components/merchant-list';
import { useDataContext } from '@/context/data-context';

export default function MerchantsApprovalPage() {
  const { merchants } = useDataContext();
  const pendingMerchants = merchants.filter(m => m.status === 'Pending');
  return <MerchantList merchants={pendingMerchants} approvalView={true}/>;
}
