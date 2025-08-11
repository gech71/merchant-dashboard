import MerchantList from '@/components/merchant-list';
import type { Merchant } from '@/types';

const MOCK_MERCHANTS: Merchant[] = [
  { id: '1', name: 'The Corner Cafe Admin', company: 'Innovate Inc.', email: 'contact@cornercafe.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'QuickMart Admin', company: 'Apex Solutions', email: 'support@quickmart.com', role: 'Admin', status: 'Active' },
  { id: '3', name: 'Gadget Hub Admin', company: 'Quantum Corp', email: 'sales@gadgethub.com', role: 'Admin', status: 'Pending' },
  { id: '4', name: 'Style Central Admin', company: 'Synergy Systems', email: 'info@stylecentral.com', role: 'Admin', status: 'Active' },
  { id: '5', name: 'Bookworm Haven Admin', company: 'Pioneer Ltd.', email: 'orders@bookwormhaven.com', role: 'Admin', status: 'Disabled' },
];

export default function MerchantsPage() {
  return <MerchantList merchants={MOCK_MERCHANTS} />;
}
