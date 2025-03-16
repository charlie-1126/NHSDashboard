import { useState } from 'react';
import { LNFHomeCard } from './LNFHomeCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { itemTable } from '~/db';
import { Link, NavLink } from 'react-router';
import { DialogTitle } from '@radix-ui/react-dialog';

export function Home({ items }: { items: (typeof itemTable.$inferSelect)[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCardClick = (item: typeof itemTable.$inferSelect) => {
    setSelectedImage(item.image?.length ? item.image : '/image/noImg.gif');
  };

  return (
    <div className='bg-background flex min-h-screen flex-col p-4'>
      <Card className='flex h-full min-h-[80vh] flex-col shadow-md'>
        <CardHeader className='border-b pb-4'>
          <CardTitle className='text-primary text-center text-2xl font-bold sm:text-2xl'>
            능주고 분실물 안내 서비스
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-grow overflow-hidden p-4'>
          <div className='h-full overflow-y-auto pr-2'>
            <div className='grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {items.map((item, index) => (
                <LNFHomeCard key={index} item={item} onClick={() => handleCardClick(item)} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div onClick={() => setSelectedImage(null)}>
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <DialogContent
            className='flex h-[70vh] w-[70vw] items-center justify-center !border-none bg-transparent !shadow-none outline-none [&>button]:hidden'
            aria-describedby={undefined}
          >
            {selectedImage && (
              <img src={selectedImage} className='h-full w-full rounded-md object-contain' />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Link to='/dashboard'>
        <div className='text-muted-foreground absolute top-12 left-10 z-50 hidden text-sm lg:block'>
          Dashboard로 전환
        </div>
      </Link>
      <Link to='/LNFMS'>
        <div className='text-muted-foreground absolute top-5 right-7 z-50 text-sm md:top-12 md:right-10'>
          LNFMS
        </div>
      </Link>
    </div>
  );
}
