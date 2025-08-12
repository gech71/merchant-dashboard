
'use client';
import StreamPaySettingsList from '@/components/stream-pay-settings-list';
import { useDataContext } from '@/context/data-context';

export default function StreamPaySettingsPage() {
  const { streamPaySettings } = useDataContext();
  return <StreamPaySettingsList streamPaySettings={streamPaySettings} />;
}
