
'use client';
import MerchantList from '@/components/merchant-list';
import { useDataContext } from '@/context/data-context';
import { Prisma } from '@prisma/client';

type MerchantUserWithRelations = Prisma.merchant_usersGetPayload<{
  include: { ApplicationRole: true }
}>

export default function MerchantUsersPage() {
  const { merchants } = useDataContext();
  return <MerchantList merchants={merchants as unknown as MerchantUserWithRelations[]} />;
}
