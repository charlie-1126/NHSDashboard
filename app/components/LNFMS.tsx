import { Link, useFetcher, useNavigate, useLoaderData } from 'react-router';
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
      <div className='from-background/50 via-background/30 to-background/60 supports-[backdrop-filter]:bg-background/40 flex-1 overflow-hidden rounded-2xl bg-gradient-to-br backdrop-blur'>
        <div className='flex h-full flex-col'>
          {/* Sticky Header */}
          <div className='supports-[backdrop-filter]:bg-background/60 border-border/60 bg-background/70 sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-3 py-2 backdrop-blur md:px-6'>
            <div className='flex items-center gap-2'>
              <Link
                to='/'
                className='hover:bg-muted/70 rounded-full p-2 transition-colors'
                aria-label='홈으로'
              >
                <House size={20} />
              </Link>
              <Link
                to='/'
                className='hover:text-primary text-xl font-semibold tracking-tight transition-colors md:text-2xl'
                aria-label='홈으로'
              >
                LNFMS
              </Link>
              {multipleSelection && (
                <span className='bg-primary/10 text-primary ml-1 rounded-full px-2 py-0.5 text-xs font-medium'>
                  {selectList.length}개 선택
                </span>
              )}
            </div>
            <div className='flex items-center gap-2 md:gap-4'>
              {multipleSelection && (
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => setMultipleReturnDialogOpen(true)}
                    className='flex h-8 cursor-pointer items-center gap-1 rounded-full bg-emerald-500/90 px-3 text-xs font-medium text-white shadow transition-colors hover:bg-emerald-500'
                  >
                    <FaCheck size={14} /> 반환
                  </button>
                  <button
                    onClick={() => setMultipleDeleteDialogOpen(true)}
                    className='flex h-8 cursor-pointer items-center gap-1 rounded-full bg-rose-500/90 px-3 text-xs font-medium text-white shadow transition-colors hover:bg-rose-500'
                  >
                    <Trash2 size={14} /> 폐기
                  </button>
                  <button
                    onClick={() => {
                      setMultipleSelection(false);
                      setSelectList([]);
                    }}
                    className='text-muted-foreground hover:text-foreground cursor-pointer text-xs'
                  >
                    취소
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  if (multipleSelection) setSelectList([]);
                  setMultipleSelection(!multipleSelection);
                }}
                className={`flex h-8 cursor-pointer items-center gap-1 rounded-full px-3 text-xs font-medium transition-colors ${
                  multipleSelection
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-muted hover:bg-muted/70'
                }`}
              >
                <LuSquareCheckBig size={16} />
                선택
              </button>
              <Link
                to='/logout'
                className='text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-2 py-1 text-xs font-medium transition-colors'
              >
                <LogOut size={16} /> Logout
              </Link>
            </div>
          </div>

          {/* Filter Section (collapsible already inside) */}
          <div className='border-border/60 border-b border-dashed px-2 py-1.5 md:px-6 md:py-2'>
            <FilterSection />
          </div>

          {/* Scrollable list */}
          <div className='custom-scrollbar relative flex-1 overflow-y-auto px-2 pt-1 pb-3 md:px-6 md:pt-2 md:pb-6'>
            {/* subtle stripes */}
            <div className='bg-[repeating-linear-gradient(135deg,theme(colors.muted/0.15),theme(colors.muted/0.15)_6px,transparent_6px,transparent_12px)] pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]' />
            <div className='relative flex flex-col gap-2 md:gap-3'>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <LNFMSCard
                    onClick={() => cardClick(index)}
                    key={item.uuid ?? index}
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
                    selected={selectList.includes(index)}
                    multiple={multipleSelection}
                    index={index}
                  />
                ))
              ) : (
                <div className='text-muted-foreground relative z-10 flex h-[55vh] flex-col items-center justify-center gap-2 text-center'>
                  <Search className='mb-1 h-10 w-10 opacity-20' />
                  <p className='text-sm leading-none font-medium'>검색 결과가 없습니다</p>
                  <p className='text-xs opacity-80'>필터를 조정하거나 초기화해 보세요</p>
                </div>
              )}
            </div>
          </div>
          {/* Pagination */}
          <div className='border-border/60 border-t border-dashed px-2 pt-1 md:px-6 md:pt-2'>
            <LNFMSPagination />
          </div>
        </div>
      </div>

      {/* Create 플로팅 버튼 */}
      <Link
        to='/item/new'
        className='shadow-primary/30 fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg ring-1 ring-white/20 transition-all hover:scale-105 hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none'
        aria-label='분실물 등록'
      >
        <LuPlus size={28} />
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
