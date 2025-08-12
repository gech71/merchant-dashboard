
'use client';
import MerchantList from '@/components/merchant-list';
import { useDataContext } from '@/context/data-context';

export default function MerchantUsersPage() {
  const { merchants } = useDataContext();
  return <MerchantList merchants={merchants} />;
}
