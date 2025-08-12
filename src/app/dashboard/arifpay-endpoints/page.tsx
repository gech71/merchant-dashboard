
'use client';
import ArifpayEndpointList from '@/components/arifpay-endpoint-list';
import { useDataContext } from '@/context/data-context';

export default function ArifpayEndpointsPage() {
  const { arifpayEndpoints } = useDataContext();
  return <ArifpayEndpointList arifpayEndpoints={arifpayEndpoints} />;
}
