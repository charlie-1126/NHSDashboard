import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LNFMSCard } from './LNFMSCard';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, LogOut, Search, Trash2 } from 'lucide-react';
import { LuSquareCheckBig, LuPlus } from 'react-icons/lu';
import { FaCheck } from 'react-icons/fa6';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as React from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
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
import { FilterSection, type FilterValues } from './filter-section';

export function LNFMS({ items }: { items: (typeof itemTable.$inferSelect)[] }) {
  const navigate = useNavigate();

  //분실물 리스트
  const [itemsList, setItemsList] = React.useState(items);
  //다중선택
  const [selectList, setSelectList] = React.useState<number[]>([]);
  const [multipleSelection, setMultipleSelection] = React.useState(false);
  //반환
  const [returnIndex, setReturnIndex] = React.useState<number | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = React.useState(false);
  const [multipleReturnDialogOpen, setMultipleReturnDialogOpen] = React.useState(false);
  //삭제
  const [deleteIndex, setDeleteIndex] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [multipleDeleteDialogOpen, setMultipleDeleteDialogOpen] = React.useState(false);
  //인수자
  const [receiverName, setReceiverName] = React.useState<string | null>(null);
  //에러
  const [error, setError] = React.useState(false);
  const [errorMulti, setErrorMulti] = React.useState(false);
  //이미지 팝업
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const onImageClick = (item: typeof itemTable.$inferSelect) => {
    setSelectedImage(item.image?.length ? item.image : '/image/noImg.gif');
  };

  // 필터링
  const [filters, setFilters] = React.useState<FilterValues>({
    startDate: undefined,
    endDate: undefined,
    location: '',
    name: '',
    status: '',
    reporter: '',
    receiver: '',
  });

  // 필터 초기화
  const resetFilters = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      location: '',
      name: '',
      status: '',
      reporter: '',
      receiver: '',
    });
  };

  // 필터링된 아이템 목록
  const filteredItems = React.useMemo(() => {
    return itemsList.filter((item) => {
      // 날짜 필터링
      if (filters.startDate && new Date(item.createdAt) < filters.startDate) {
        return false;
      }
      if (filters.endDate) {
        const endDateWithTime = new Date(filters.endDate);
        endDateWithTime.setHours(23, 59, 59, 999);
        if (new Date(item.createdAt) > endDateWithTime) {
          return false;
        }
      }

      // 위치 필터링
      if (
        filters.location &&
        !item.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // 이름 필터링
      if (filters.name && !item.name?.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // 상태 필터링
      if (filters.status && item.status !== filters.status && filters.status !== 'ALL') {
        return false;
      }

      // 제보자 필터링
      if (
        filters.reporter &&
        !item.reporter?.toLowerCase().includes(filters.reporter.toLowerCase())
      ) {
        return false;
      }

      // 인수자 필터링
      if (
        filters.receiver &&
        !item.receiver?.toLowerCase().includes(filters.receiver.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [itemsList, filters]);

  // 단일 삭제
  const deleteItem = () => {
    if (deleteIndex !== null) {
      setItemsList(itemsList.filter((_, i) => i !== deleteIndex));
      setDeleteIndex(null);
    }
    setDeleteDialogOpen(false);
  };

  // 단일 반환
  const returnItem = () => {
    if (returnIndex !== null) {
      setItemsList(itemsList.filter((_, i) => i !== returnIndex));
      setReturnIndex(null);
    }
    setReturnDialogOpen(false);
  };

  // 다중 삭제 처리
  const multipleDeleteItem = () => {
    setItemsList(itemsList.filter((_, i) => !selectList.includes(i)));
    setSelectList([]);
    setMultipleSelection(false);
    setMultipleDeleteDialogOpen(false);
  };

  // 다중 반환 처리
  const multipleReturnItem = () => {
    setItemsList(itemsList.filter((_, i) => !selectList.includes(i)));
    setSelectList([]);
    setMultipleSelection(false);
    setMultipleReturnDialogOpen(false);
  };

  // 카드클릭 로직
  const cardClick = (index: number) => {
    if (!multipleSelection) {
      //단일 선택 로직
      navigate(`/item/${itemsList[index].uuid}`);
    } else {
      //다중 선택 로직
      let copy = [...selectList];
      copy = copy.includes(index) ? copy.filter((i) => i !== index) : [...copy, index];
      setSelectList(copy);
    }
  };

  return (
    <div className='flex h-screen flex-col p-2 md:p-4'>
      <Card className='flex h-full flex-col gap-4'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 px-2.5 pr-5 md:px-6'>
          <div className='flex items-center gap-2'>
            {/* 뒤로가기 버튼 */}
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
                  setErrorMulti(false);
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
              className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm transition-colors'
            >
              <LogOut size={18} />
              Logout
            </Link>
          </div>
        </CardHeader>

        {/* 필터 섹션 */}
        <CardContent className='px-2 py-0 md:px-6'>
          <FilterSection filters={filters} setFilters={setFilters} resetFilters={resetFilters} />
        </CardContent>

        {/* 분실물 카드 */}
        <CardContent className='flex-1 space-y-4 overflow-y-auto px-2 pb-4 md:px-6'>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <LNFMSCard
                onClick={() => cardClick(index)}
                key={index}
                item={item}
                onReturn={() => {
                  setReturnIndex(index);
                  setError(false);
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
            <div className='text-muted-foreground flex flex-col items-center justify-center py-10 text-center'>
              <Search className='mb-2 h-10 w-10 opacity-20' />
              <p>검색 결과가 없습니다</p>
              <p className='text-sm'>필터를 조정하거나 초기화해 보세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create 플로팅 버튼 */}
      <Link
        to='/item/new'
        className='fixed right-10 bottom-10 z-50 flex cursor-pointer items-center justify-center rounded-full bg-blue-400 p-3.5 text-white shadow-lg transition-colors hover:bg-blue-500 hover:shadow-sm'
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
              {returnIndex !== null && itemsList[returnIndex]
                ? `"${itemsList[returnIndex].name}" 항목을 반환하시겠습니까?`
                : '이 항목을 반환하시겠습니까?'}
            </DialogDescription>
          </DialogHeader>
          <div className='pt-1'>
            <Label>인수자</Label>
          </div>
          <Input
            name='recieverName'
            type='id'
            required
            onChange={(name) => setReceiverName(name.target.value)}
            className={`${error ? 'border-2 border-red-500' : ''}`}
          ></Input>
          <DialogFooter>
            <Button variant='outline' onClick={() => setReturnDialogOpen(false)}>
              취소
            </Button>
            <Button
              className='bg-green-500 text-white hover:bg-green-600'
              onClick={() => {
                if (receiverName) {
                  returnItem();
                  setError(false);
                } else {
                  setError(true);
                }
              }}
              type='submit'
            >
              반환
            </Button>
          </DialogFooter>
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
          </div>
          <Input
            name='recieverName'
            type='id'
            required
            onChange={(name) => setReceiverName(name.target.value)}
            className={`${errorMulti ? 'border-2 border-red-500' : ''}`}
          ></Input>
          <DialogFooter>
            <Button variant='outline' onClick={() => setMultipleReturnDialogOpen(false)}>
              취소
            </Button>
            <Button
              className='bg-green-500 text-white hover:bg-green-600'
              onClick={() => {
                if (receiverName) {
                  multipleReturnItem();
                  setErrorMulti(false);
                } else {
                  setErrorMulti(true);
                }
              }}
              type='submit'
            >
              반환
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 단일 삭제 모달 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
            <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant='destructive' onClick={deleteItem}>
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
            <DialogDescription>
              선택한 {selectList.length}개의 항목들을 삭제하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setMultipleDeleteDialogOpen(false)}>
              취소
            </Button>
            <Button variant='destructive' onClick={multipleDeleteItem}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 이미지 팝업 모달 */}
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
    </div>
  );
}
