
'use client';
import AuditLogList from '@/components/audit-log-list';
import { useDataContext } from '@/context/data-context';

export default function AuditLogPage() {
  const { auditLogs } = useDataContext();
  return <AuditLogList auditLogs={auditLogs} />;
}
