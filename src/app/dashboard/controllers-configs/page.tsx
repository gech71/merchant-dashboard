
'use client';
import ControllersConfigList from '@/components/controllers-config-list';
import { useDataContext } from '@/context/data-context';

export default function ControllersConfigsPage() {
  const { controllersConfigs } = useDataContext();
  return <ControllersConfigList controllersConfigs={controllersConfigs} />;
}
