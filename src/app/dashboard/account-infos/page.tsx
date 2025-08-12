
'use client';
import AccountInfoList from '@/components/account-info-list';
import { useDataContext } from '@/context/data-context';

export default function AccountInfosPage() {
  const { accountInfos } = useDataContext();
  return <AccountInfoList accountInfos={accountInfos} />;
}
