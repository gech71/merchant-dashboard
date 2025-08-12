
'use client';

import * as React from 'react';
import type { promo_adds } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

export default function PromoAddList({ promoAdds }: { promoAdds: promo_adds[] }) {
  const sortedAdds = React.useMemo(() => {
    return [...promoAdds].sort((a, b) => a.ORDER - b.ORDER);
  }, [promoAdds]);

  return (
    <div className="space-y-6">
       <CardHeader className="p-0">
          <CardTitle className="text-3xl">Promotional Ads</CardTitle>
          <CardDescription>A list of current promotional advertisements.</CardDescription>
        </CardHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedAdds.map((ad) => (
          <Card key={ad.ID} className="overflow-hidden">
            <div className="relative h-48 w-full">
               <Image 
                src={ad.IMAGEADDRESS} 
                alt={ad.ADDTITLE} 
                layout="fill"
                objectFit="cover"
                data-ai-hint="advertisement marketing"
              />
            </div>
            <CardHeader>
              <CardTitle>{ad.ADDTITLE}</CardTitle>
              <CardDescription>{ad.ADDSUBTITLE}</CardDescription>
            </CardHeader>
            <CardFooter>
               <Button asChild className="w-full">
                <Link href={ad.ADDADDRESS} target="_blank" rel="noopener noreferrer">
                  Learn More
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
