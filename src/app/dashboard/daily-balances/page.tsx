
'use client';
import DailyBalanceList from '@/components/daily-balance-list';
import { useDataContext } from '@/context/data-context';

export default function DailyBalancesPage() {
  const { dailyBalances } = useDataContext();
  return <DailyBalanceList dailyBalances={dailyBalances} />;
}
