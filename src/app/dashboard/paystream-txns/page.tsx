
'use client';
import PaystreamTxnList from '@/components/paystream-txn-list';
import { useDataContext } from '@/context/data-context';

export default function PaystreamTxnsPage() {
  const { paystreamTxns } = useDataContext();
  return <PaystreamTxnList paystreamTxns={paystreamTxns} />;
}
