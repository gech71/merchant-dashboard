
'use client';
import UssdPushSettingsList from '@/components/ussd-push-settings-list';
import { useDataContext } from '@/context/data-context';

export default function UssdPushSettingsPage() {
  const { ussdPushSettings } = useDataContext();
  return <UssdPushSettingsList ussdPushSettings={ussdPushSettings} />;
}
