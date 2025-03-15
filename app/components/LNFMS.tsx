'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LNFMSCard } from './ui/LNFMS_card';
import { ArrowLeft, LogOut } from 'lucide-react';
import * as React from 'react';
import { NavLink } from 'react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

const items = [
  {
    title: '갤럭시 버즈3 프로',
    dateAcquired: '2025-03-13',
    location: '2-4',
    disposalDate: '2025-03-27',
    image: 'https://url.kr/cqi4sj',
  },
  {
    title: '아이폰 15',
    dateAcquired: '2025-03-10',
    location: '3-2',
    disposalDate: '2025-03-25',
    image: 'https://blog.kakaocdn.net/dn/cZIUet/btsEGiAfpmX/xiFZZnhWZJQwlrNKW8fPX1/img.jpg',
  },
  {
    title: '태블릿 X',
    dateAcquired: '2025-03-05',
    location: '1-1',
    disposalDate: '2025-03-20',
    image: '',
  },
  {
    title: '스마트워치 Z',
    dateAcquired: '2025-03-01',
    location: '4-3',
    disposalDate: '2025-03-15',
    image: '',
  },
];

export function LNFMS() {
  const [itemsList, setItemsList] = React.useState(items);
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleDeleteRequest = (index: number) => {
    setDeleteIndex(index);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    //삭제
    if (deleteIndex !== null) {
      setItemsList(itemsList.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
    setDialogOpen(false);
  };

  const handleLogout = () => {
    //로그아웃
  };

  return (
    <div className='flex h-screen flex-col p-4'>
      <Card className='flex h-full flex-col'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <div className='flex items-center gap-2'>
            <NavLink to='/'>
              <button
                className='hover:bg-muted rounded-full p-2 transition-colors'
                aria-label='뒤로 가기'
              >
                <ArrowLeft size={20} />
              </button>
            </NavLink>
            <CardTitle className='text-2xl'>LNFMS</CardTitle>
          </div>
          <NavLink to='/login'>
            <button
              onClick={handleLogout}
              className='text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors'
            >
              <LogOut size={16} />
              Logout
            </button>
          </NavLink>
        </CardHeader>
        <CardContent className='flex-1 space-y-4 overflow-y-auto'>
          {itemsList.map((item, index) => (
            <LNFMSCard key={index} feature={item} onDelete={() => handleDeleteRequest(index)} />
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>항목 삭제</DialogTitle>
            <DialogDescription>
              {deleteIndex !== null && itemsList[deleteIndex]
                ? `"${itemsList[deleteIndex].title}" 항목을 삭제하시겠습니까?`
                : '이 항목을 삭제하시겠습니까?'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>
              취소
            </Button>
            <Button variant='destructive' onClick={handleConfirmDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
