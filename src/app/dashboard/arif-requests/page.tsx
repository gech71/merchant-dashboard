
'use client';
import ArifRequestList from '@/components/arif-request-list';
import { useDataContext } from '@/context/data-context';

export default function ArifRequestsPage() {
  const { arifRequests } = useDataContext();
  return <ArifRequestList arifRequests={arifRequests} />;
}
