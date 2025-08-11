
'use client';
import MerchantList from '@/components/merchant-list';
import { useDataContext } from '@/context/data-context';

export default function MerchantsPage() {
  const { merchants } = useDataContext();
  return <MerchantList merchants={merchants} />;
}
