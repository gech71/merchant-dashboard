
'use client';
import QrPaymentList from '@/components/qr-payment-list';
import { useDataContext } from '@/context/data-context';

export default function QrPaymentsPage() {
  const { qrPayments } = useDataContext();
  return <QrPaymentList qrPayments={qrPayments} />;
}
