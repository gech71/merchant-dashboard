
'use client';

import * as React from 'react';
import type { promo_adds } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { MoreVertical, Edit, Trash2, PlusCircle } from 'lucide-react';
import { useDataContext } from '@/context/data-context';
import { useToast } from '@/hooks/use-toast';
import { EditPromoAdForm } from './edit-promo-add-form';
import { AddPromoAdForm } from './add-promo-add-form';

export default function PromoAddList({ promoAdds }: { promoAdds: promo_adds[] }) {
  const { deletePromoAd } = useDataContext();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [selectedAd, setSelectedAd] = React.useState<promo_adds | null>(null);
  const [adToDelete, setAdToDelete] = React.useState<string | null>(null);

  const sortedAdds = React.useMemo(() => {
    return [...promoAdds].sort((a, b) => a.ORDER - b.ORDER);
  }, [promoAdds]);
  
  const handleEdit = (ad: promo_adds) => {
    setSelectedAd(ad);
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!adToDelete) return;
    try {
      await deletePromoAd(adToDelete);
      toast({
        title: "Ad Deleted",
        description: "The promotional ad has been successfully deleted.",
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: "Error",
        description: "Failed to delete the ad.",
      });
    } finally {
      setAdToDelete(null);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl">Promotional Ads</CardTitle>
            <CardDescription>A list of current promotional advertisements.</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9 gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>Add New Ad</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Promotional Ad</DialogTitle>
              </DialogHeader>
              <AddPromoAdForm setOpen={setIsAddDialogOpen} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedAdds.map((ad) => (
            <Card key={ad.ID} className="overflow-hidden group">
               <div className="relative">
                <div className="absolute top-2 right-2 z-10">
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm">
                           <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(ad)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setAdToDelete(ad.ID)} className="text-red-600 focus:text-red-600">
                           <Trash2 className="mr-2 h-4 w-4" />
                           <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="relative h-48 w-full">
                  <Image 
                    src={ad.IMAGEADDRESS} 
                    alt={ad.ADDTITLE} 
                    layout="fill"
                    objectFit="cover"
                    data-ai-hint="advertisement marketing"
                  />
                </div>
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
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Promotional Ad</DialogTitle>
          </DialogHeader>
          {selectedAd && <EditPromoAdForm promoAd={selectedAd} setOpen={setIsEditDialogOpen} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!adToDelete} onOpenChange={(open) => !open && setAdToDelete(null)}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this promotional ad.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
