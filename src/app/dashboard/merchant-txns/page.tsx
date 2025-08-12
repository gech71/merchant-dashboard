
'use client';
import MerchantTxnList from '@/components/merchant-txn-list';
import { useDataContext } from '@/context/data-context';

export default function MerchantTxnsPage() {
  const { merchantTxns } = useDataContext();
  return <MerchantTxnList merchantTxns={merchantTxns} />;
}
