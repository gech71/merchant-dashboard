
'use client';
import BranchList from '@/components/branch-list';
import { useDataContext } from '@/context/data-context';

export default function BranchesPage() {
  const { branches } = useDataContext();
  return <BranchList branches={branches} />;
}
