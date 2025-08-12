
'use client';
import RoleCapabilityList from '@/components/role-capability-list';
import { useDataContext } from '@/context/data-context';

export default function RoleCapabilitiesPage() {
  const { roleCapabilities } = useDataContext();
  return <RoleCapabilityList roleCapabilities={roleCapabilities} />;
}
