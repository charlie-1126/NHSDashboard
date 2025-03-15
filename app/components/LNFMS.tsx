import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LNFMSCard } from './LNFMSCard';
import { ArrowLeft, LogOut, Trash2 } from 'lucide-react';
import { LuSquareCheckBig } from 'react-icons/lu';
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
import type { itemTable } from '~/db';

export function LNFMS({ items }: { items: (typeof itemTable.$inferSelect)[] }) {
  const [itemsList, setItemsList] = React.useState(items);
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [EditdialogOpen, setEditDialogOpen] = React.useState(false);
  const [multipleSelection, setMultipleSelection] = React.useState(false);
  const [selectList, setSelectList] = React.useState<number[]>([]);
  const [multipleDeleteDialogOpen, setMultipleDeleteDialogOpen] = React.useState(false);

  const handleDeleteRequest = (index: number) => {
    setDeleteIndex(index);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    // 단일 삭제
    if (deleteIndex !== null) {
      setItemsList(itemsList.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
    setDialogOpen(false);
  };

  const multipleDeleteHandler = () => {
    // 다중 삭제 처리
    setItemsList(itemsList.filter((_, i) => !selectList.includes(i)));
    setSelectList([]);
    setMultipleSelection(false);
    setMultipleDeleteDialogOpen(false);
  };

  const handleLogout = () => {
    // 로그아웃 로직
  };

  const cardClick = (index: number) => {
    // 카드클릭 로직
    if (!multipleSelection) {
      //단일 선택 로직
      console.log(1);
    } else {
      let copy = [...selectList];
      copy = copy.includes(index) ? copy.filter((i) => i !== index) : [...copy, index];
      setSelectList(copy);
    }
  };

  return (
    <div className='flex h-screen flex-col p-4'>
      <Card className='flex h-full flex-col'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0'>
          <div className='flex items-center gap-2'>
            <NavLink to='/'>
              <button
                className='hover:bg-muted cursor-pointer rounded-full p-2 transition-colors'
                aria-label='뒤로 가기'
              >
                <ArrowLeft size={20} />
              </button>
            </NavLink>
            <CardTitle className='text-2xl'>LNFMS</CardTitle>
          </div>
          <div className='flex items-center gap-5'>
            <div
              className={`flex gap-2 transition-all duration-300 ease-out ${
                multipleSelection
                  ? 'translate-x-3 opacity-100'
                  : 'pointer-events-none translate-x-10 opacity-0'
              }`}
            >
              <button
                onClick={() => setMultipleDeleteDialogOpen(true)}
                className='cursor-pointer rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-100'
                aria-label='삭제'
              >
                <Trash2 size={20} />
              </button>
            </div>
            <button
              onClick={() => {
                if (multipleSelection) {
                  setSelectList([]);
                }
                setMultipleSelection(!multipleSelection);
              }}
              className={`flex cursor-pointer items-center gap-1 rounded-full p-1.5 text-sm text-black transition-colors ${
                multipleSelection ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <LuSquareCheckBig size={18} />
            </button>

            {/* 로그아웃 버튼 */}
            <NavLink to='/login'>
              <button
                onClick={handleLogout}
                className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm transition-colors'
              >
                <LogOut size={16} />
                Logout
              </button>
            </NavLink>
          </div>
        </CardHeader>
        <CardContent className='flex-1 space-y-4 overflow-y-auto pb-4'>
          {itemsList.map((item, index) => (
            <LNFMSCard
              onClick={() => cardClick(index)}
              key={index}
              item={item}
              onDelete={() => handleDeleteRequest(index)}
              className={`cursor-pointer transition-colors ${
                selectList.includes(index) ? 'bg-blue-50' : ''
              }`}
            />
          ))}
        </CardContent>
      </Card>

      {/* 단일 삭제 모달 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 삭제</DialogTitle>
            <DialogDescription>
              {deleteIndex !== null && itemsList[deleteIndex]
                ? `"${itemsList[deleteIndex].name}" 항목을 삭제하시겠습니까?`
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

      {/* 다중 삭제 모달 */}
      <Dialog open={multipleDeleteDialogOpen} onOpenChange={setMultipleDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 다중 삭제</DialogTitle>
            <DialogDescription>선택한 항목들을 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setMultipleDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant='destructive' onClick={multipleDeleteHandler}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={EditdialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 수정</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
