
'use client';
import BranchList from '@/components/branch-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type BranchWithRelations = Prisma.BranchGetPayload<{
  include: {}
}>

export default function BranchesPage() {
  const { branches } = useDataContext();
  return <BranchList branches={branches as unknown as BranchWithRelations[]} />;
}
