
'use client';
import PromoAddList from '@/components/promo-add-list';
import { useDataContext } from '@/context/data-context';

export default function PromoAddsPage() {
  const { promoAdds } = useDataContext();
  return <PromoAddList promoAdds={promoAdds} />;
}
