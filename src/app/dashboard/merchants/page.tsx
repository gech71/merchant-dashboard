import MerchantList from '@/components/merchant-list';
import type { Merchant } from '@/types';

const MOCK_MERCHANTS: Merchant[] = [
  { id: '1', name: 'The Corner Cafe', company: 'Innovate Inc.', email: 'contact@cornercafe.com', status: 'Active' },
  { id: '2', name: 'QuickMart', company: 'Apex Solutions', email: 'support@quickmart.com', status: 'Active' },
  { id: '3', name: 'Gadget Hub', company: 'Quantum Corp', email: 'sales@gadgethub.com', status: 'Pending' },
  { id: '4', name: 'Style Central', company: 'Synergy Systems', email: 'info@stylecentral.com', status: 'Active' },
  { id: '5', name: 'Bookworm Haven', company: 'Pioneer Ltd.', email: 'orders@bookwormhaven.com', status: 'Disabled' },
];

export default function MerchantsPage() {
  return <MerchantList merchants={MOCK_MERCHANTS} />;
}
