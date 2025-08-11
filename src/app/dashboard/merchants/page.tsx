
import MerchantList from '@/components/merchant-list';
import type { Merchant } from '@/types';

const MOCK_MERCHANTS: Merchant[] = [
  { id: '1', name: 'The Corner Cafe Admin', company: 'Innovate Inc.', email: 'contact@cornercafe.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'QuickMart Admin', company: 'Apex Solutions', email: 'support@quickmart.com', role: 'Admin', status: 'Active' },
  { id: '3', name: 'Gadget Hub Admin', company: 'Quantum Corp', email: 'sales@gadgethub.com', role: 'Admin', status: 'Pending' },
  { id: '4', name: 'Style Central Admin', company: 'Synergy Systems', email: 'info@stylecentral.com', role: 'Admin', status: 'Active' },
  { id: '5', name: 'Bookworm Haven Admin', company: 'Pioneer Ltd.', email: 'orders@bookwormhaven.com', role: 'Admin', status: 'Disabled' },
  { id: '6', name: 'Alice Johnson', company: 'Innovate Inc.', email: 'alice.j@example.com', role: 'Sales', status: 'Active' },
  { id: '7', name: 'Bob Williams', company: 'Apex Solutions', email: 'bob.w@example.com', role: 'Sales', status: 'Active' },
  { id: '8', name: 'Diana Prince', company: 'Synergy Systems', email: 'diana.p@example.com', role: 'Sales', status: 'Pending' },
];

export default function MerchantsPage() {
  return <MerchantList merchants={MOCK_MERCHANTS} />;
}
