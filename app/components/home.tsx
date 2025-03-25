import { useState } from 'react';
import { LNFHomeCard } from './LNFHomeCard';
import { Dialog, DialogContent } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { itemTable } from '~/db';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Navbar } from './ui/navbar';

export function Home({ items }: { items: (typeof itemTable.$inferSelect)[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCardClick = (item: typeof itemTable.$inferSelect) => {
    setSelectedImage(item.image?.length ? item.image : '/image/noImg.gif');
  };

  return (
    <div className='bg-background flex h-screen flex-col p-4'>
      <div>
        <Navbar />
      </div>
      <div className='flex h-full min-h-[80vh] flex-col'>
        <div className='h-full overflow-y-auto'>
          <div className='grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {items.map((item, index) => (
              <LNFHomeCard key={index} item={item} onClick={() => handleCardClick(item)} />
            ))}
          </div>
        </div>
      </div>

      <div onClick={() => setSelectedImage(null)}>
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <VisuallyHidden>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <DialogContent className='flex h-[70vh] w-[70vw] items-center justify-center !border-none bg-transparent !shadow-none outline-none [&>button]:hidden'>
            {selectedImage && (
              <img src={selectedImage} className='h-full w-full rounded-md object-contain' />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
