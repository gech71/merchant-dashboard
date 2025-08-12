
'use client';
import CoreIntegrationSettingsList from '@/components/core-integration-settings-list';
import { useDataContext } from '@/context/data-context';

export default function CoreIntegrationSettingsPage() {
  const { coreIntegrationSettings } = useDataContext();
  return <CoreIntegrationSettingsList coreIntegrationSettings={coreIntegrationSettings} />;
}
