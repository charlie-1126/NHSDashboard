import { Link, useFetcher, useNavigate, useLoaderData } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LNFMSCard } from './LNFMSCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { House, LogOut, Search, Trash2 } from 'lucide-react';
import { LuSquareCheckBig, LuPlus } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa6';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as React from 'react';
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
import { FilterSection } from './filter-section';
import type { loader } from '~/routes/LNFMS';
import { LNFMSPagination } from './LNFMSPagination';

export function LNFMS() {
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const { items } = useLoaderData<typeof loader>();

  //* dialogs
  const [multipleDeleteDialogOpen, setMultipleDeleteDialogOpen] = React.useState(false);
  const [multipleReturnDialogOpen, setMultipleReturnDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false);

  //다중선택
  const [selectList, setSelectList] = React.useState<number[]>([]);
  const [multipleSelection, setMultipleSelection] = React.useState(false);

  //반환
  const [returnIndex, setReturnIndex] = React.useState<number | null>(null);
  //삭제
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  //인수자
  const [receiverName, setReceiverName] = React.useState<string | null>(null);
  //이미지 팝업
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const onImageClick = (item: typeof itemTable.$inferSelect) => {
    setSelectedImage(item.image?.length ? item.image : '/image/noImg.gif');
  };

  //* handlers
  React.useEffect(() => {
    if (fetcher.data && fetcher.data.ok && fetcher.data.type) {
      switch (fetcher.data.type) {
        case 'deleteItem':
          setDeleteDialogOpen(false);
          break;
        case 'deleteItems':
          setMultipleDeleteDialogOpen(false);
          setSelectList([]);
          setMultipleSelection(false);
          break;
        case 'returnItem':
          setReturnDialogOpen(false);
          break;
        case 'returnItems':
          setSelectList([]);
          setMultipleSelection(false);
          setMultipleReturnDialogOpen(false);
          break;
      }
    }
  }, [fetcher.data]);

  // 카드클릭 로직
  const cardClick = (index: number) => {
    if (!multipleSelection) {
      //단일 선택 로직
      navigate(`/item/${items[index].uuid}`);
    } else {
      //다중 선택 로직
      let copy = [...selectList];
      copy = copy.includes(index) ? copy.filter((i) => i !== index) : [...copy, index];
      setSelectList(copy);
    }
  };

  return (
    <div className='flex h-screen flex-col p-2 md:p-4 md:pb-2'>
      <div className='flex-1 overflow-y-auto'>
        <Card className='flex h-full flex-col gap-4 pb-0'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 px-2.5 pr-5 md:px-6'>
            <div className='flex items-center justify-center gap-2'>
              {/* 뒤로가기 버튼 */}
              <Link
                to='/'
                className='hover:bg-muted cursor-pointer rounded-full p-2 transition-colors'
              >
                <House size={20} />
              </Link>
              <CardTitle className='text-2xl leading-none select-none'>LNFMS</CardTitle>
            </div>
            <div className='flex items-center gap-4'>
              {/* 다중선택시 나오는 구역 */}
              <div
                className={`flex gap-0 transition-all duration-300 ease-out md:gap-2 ${
                  multipleSelection
                    ? 'translate-x-3 opacity-100'
                    : 'pointer-events-none translate-x-10 opacity-0'
                }`}
              >
                {/* 다중 반환 버튼 */}
                <button
                  onClick={() => {
                    setMultipleReturnDialogOpen(true);
                  }}
                  className='cursor-pointer rounded-full p-1.5 text-green-400 transition-colors hover:bg-green-100'
                  aria-label='다중반환'
                >
                  <FaCheck size={20} />
                </button>
                {/* 다중 삭제 버튼 */}
                <button
                  onClick={() => setMultipleDeleteDialogOpen(true)}
                  className='cursor-pointer rounded-full p-1.5 text-red-500 transition-colors hover:bg-red-100'
                  aria-label='다중삭제'
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {/* 다중 선택 버튼 */}
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
              <Link
                to='/logout'
                className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm transition-colors select-none'
              >
                <LogOut size={18} />
                Logout
              </Link>
            </div>
          </CardHeader>

          {/* 필터 섹션 */}
          <CardContent className='px-2 py-0 md:px-6'>
            <FilterSection />
          </CardContent>

          {/* 분실물 카드 */}
          <CardContent
            className={`flex-1 space-y-4 overflow-y-auto px-2 pb-4 md:px-6 ${items.length > 0 ? '' : 'flex items-center justify-center'}`}
          >
            {items.length > 0 ? (
              items.map((item, index) => (
                <LNFMSCard
                  onClick={() => cardClick(index)}
                  key={index}
                  item={item}
                  onReturn={() => {
                    setReturnIndex(index);
                    setReturnDialogOpen(true);
                  }}
                  onDelete={() => {
                    setDeleteIndex(index);
                    setDeleteDialogOpen(true);
                  }}
                  onImageClick={() => {
                    onImageClick(item);
                  }}
                  className={`cursor-pointer transition-colors ${selectList.includes(index) ? 'bg-blue-50' : ''}`}
                  multiple={multipleSelection}
                />
              ))
            ) : (
              <div className='text-muted-foreground flex flex-col items-center justify-center pb-15 text-center select-none'>
                <Search className='mb-2 h-10 w-10 opacity-20' />
                <p>검색 결과가 없습니다</p>
                <p className='text-sm'>필터를 조정하거나 초기화해 보세요</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='pt-2 select-none'>
        <LNFMSPagination />
      </div>

      {/* Create 플로팅 버튼 */}
      <Link
        to='/item/new'
        className='fixed right-10 bottom-17 z-50 flex cursor-pointer items-center justify-center rounded-full bg-blue-400 p-3.5 text-white shadow-lg transition-colors hover:bg-blue-500 hover:shadow-sm'
        aria-label='Create'
      >
        <LuPlus size={24} />
      </Link>

      {/* 모달 */}

      {/* 단일 반환 모달 */}
      <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 반환</DialogTitle>
            <DialogDescription>
              {returnIndex !== null && items[returnIndex]
                ? `"${items[returnIndex].name}" 항목을 반환하시겠습니까?`
                : '이 항목을 반환하시겠습니까?'}
            </DialogDescription>
          </DialogHeader>
          <div className='pt-1'>
            <Label>인수자</Label>
            {fetcher.data?.errors?.receiver && (
              <div className='text-[13px] text-red-500'>{fetcher.data.errors.receiver}</div>
            )}
          </div>
          <fetcher.Form method='post'>
            <input type='hidden' name='uuid' value={items[returnIndex!]?.uuid} />
            <input type='hidden' name='type' value='returnItem' />
            <Input
              name='receiver'
              type='id'
              required
              onChange={(name) => setReceiverName(name.target.value)}
            ></Input>
            <DialogFooter className='pt-3'>
              <Button variant='outline' onClick={() => setReturnDialogOpen(false)}>
                취소
              </Button>
              <Button
                className='bg-green-500 text-white hover:bg-green-600'
                type='submit'
                disabled={receiverName ? false : true}
              >
                반환
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      {/* 다중 반환 모달 */}
      <Dialog open={multipleReturnDialogOpen} onOpenChange={setMultipleReturnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 다중 반환</DialogTitle>
            <DialogDescription>
              선택한 {selectList.length}개의 항목들을 반환하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <div className='pt-1'>
            <Label>인수자</Label>
            {fetcher.data?.errors?.receiver && (
              <div className='text-[13px] text-red-500'>{fetcher.data.errors.receiver}</div>
            )}
          </div>
          <fetcher.Form method='post'>
            {selectList.map((i) => (
              <input type='hidden' name='uuid' value={items[i].uuid} />
            ))}
            <input type='hidden' name='type' value='returnItems' />
            <Input
              name='receiver'
              type='id'
              required
              onChange={(name) => setReceiverName(name.target.value)}
            ></Input>
            <DialogFooter className='pt-3'>
              <Button variant='outline' onClick={() => setMultipleReturnDialogOpen(false)}>
                취소
              </Button>
              <Button
                className='bg-green-500 text-white hover:bg-green-600'
                type='submit'
                disabled={receiverName ? false : true}
              >
                반환
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      {/* 단일 폐기 모달 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 폐기</DialogTitle>
            <DialogDescription>
              {deleteIndex !== null && items[deleteIndex]
                ? `"${items[deleteIndex].name}" 항목을 폐기하시겠습니까?`
                : '이 항목을 폐기하시겠습니까?'}
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method='post'>
            <DialogFooter>
              <input type='hidden' name='uuid' value={items[deleteIndex!]?.uuid} />
              <input type='hidden' name='type' value='deleteItem' />
              <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                취소
              </Button>
              <Button type='submit' variant='destructive'>
                폐기
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      {/* 다중 폐기 모달 */}
      <Dialog open={multipleDeleteDialogOpen} onOpenChange={setMultipleDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 다중 폐기</DialogTitle>
            <DialogDescription>
              선택한 {selectList.length}개의 항목들을 폐기하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method='post'>
            <DialogFooter>
              {selectList.map((i) => (
                <input type='hidden' name='uuid' value={items[i].uuid} />
              ))}
              <input type='hidden' name='type' value='deleteItems' />
              <Button variant='outline' onClick={() => setMultipleDeleteDialogOpen(false)}>
                취소
              </Button>
              <Button type='submit' variant='destructive'>
                폐기
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>

      {/* 이미지 팝업 모달 */}
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
