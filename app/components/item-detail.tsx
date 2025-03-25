import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarIcon, ArrowLeft, Save, X, LoaderCircle, Trash2, PackagePlus } from 'lucide-react';
import { format, add } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as React from 'react';
import { useFetcher, useNavigate } from 'react-router';
import type { itemTable } from '~/db';

type ItemDetailProps = {
  item?: typeof itemTable.$inferSelect | null;
  id: string;
};

export function ItemDetail({ item, id }: ItemDetailProps) {
  const navigate = useNavigate();
  const isNewItem = !id || id === 'new';

  const fetcher = useFetcher();

  //삭제
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // 폼 상태 관리
  const [formData, setFormData] = React.useState<
    Omit<typeof itemTable.$inferSelect, 'uuid' | 'createdAt' | 'processedAt'> & {
      uuid: string;
      createdAt: Date;
      processedAt: Date;
    }
  >({
    uuid: item?.uuid ?? 'new',
    name: item?.name ?? '',
    location: item?.location ?? '',
    createdAt: item?.createdAt ?? new Date(),
    processedAt: item?.processedAt ?? add(new Date(), { months: 1 }),
    reporter: item?.reporter ?? '',
    receiver: item?.receiver ?? '',
    status: item?.status ?? 'PENDING',
    image: item?.image ?? '',
  });

  // 이미지 미리보기 상태
  const [imagePreview, setImagePreview] = React.useState<string | null>(formData.image ?? null);

  // 이미지 업로드 처리
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='container mx-auto max-w-3xl p-4'>
      <div className='mb-4 flex items-center'>
        <button
          onClick={() => navigate('/LNFMS')}
          className='hover:bg-muted mr-2 cursor-pointer rounded-full p-2 transition-colors'
          aria-label='뒤로 가기'
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className='text-2xl font-bold select-none'>
          {isNewItem ? '새 분실물 등록' : '분실물 상세 정보'}
        </h1>
      </div>

      <fetcher.Form method='post' encType='multipart/form-data'>
        <input type='hidden' name='uuid' value={formData.uuid} />
        <Card>
          <CardHeader>
            <CardTitle className='text-lg select-none'>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* 이미지 업로드 */}
            <div className='space-y-2'>
              <Label>
                사진 <span className='font-bold text-red-500'>*</span>
              </Label>
              <div className='flex flex-col items-center space-y-2'>
                {imagePreview ? (
                  <div className='relative'>
                    <img
                      src={imagePreview ?? '/image/noImg.gif'}
                      alt='미리보기'
                      className='h-48 w-48 cursor-pointer rounded-md border-2 border-gray-300 object-cover'
                      onClick={handleImageClick}
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-0 right-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full select-none'
                      onClick={() => {
                        setImagePreview(null);
                        setFormData((prev) => ({ ...prev, imageUrl: '' }));
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ) : (
                  <div className='relative'>
                    <img
                      src={'/image/noImg.gif'}
                      alt='이미지 없음'
                      className='h-48 w-48 cursor-pointer rounded-md border-2 border-gray-300 object-cover select-none'
                      onClick={handleImageClick}
                    />
                  </div>
                )}
                {fetcher.data?.errors?.image && (
                  <div className='text-[13px] text-red-500'>{fetcher.data.errors.image}</div>
                )}
                <input
                  ref={fileInputRef}
                  name='image'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* 이름 */}
            <div className='space-y-2'>
              <Label>
                이름 <span className='font-bold text-red-500'>*</span>
              </Label>
              <Input
                name='name'
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder='분실물 이름'
                required
              />
              {fetcher.data?.errors?.name && (
                <div className='text-[13px] text-red-500'>{fetcher.data.errors.name}</div>
              )}
            </div>

            {/* 취득장소 */}
            <div className='space-y-2'>
              <Label>
                취득장소 <span className='font-bold text-red-500'>*</span>
              </Label>
              <Input
                name='location'
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder='취득 장소'
                required
              />
              {fetcher.data?.errors?.name && (
                <div className='text-[13px] text-red-500'>{fetcher.data.errors.name}</div>
              )}
            </div>

            {/* 취득 일자 */}
            <div className='space-y-2'>
              <Label>
                취득 일자 <span className='font-bold text-red-500'>*</span>
              </Label>
              <input type='hidden' name='createdAt' value={formData.createdAt.toISOString()} />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    name='createdAt'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.createdAt ? (
                      format(formData.createdAt, 'yyyy년 MM월 dd일', { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.createdAt}
                    onSelect={(date) =>
                      date &&
                      setFormData((prev) => ({
                        ...prev,
                        createdAt: date,
                        processedAt: add(date, { months: 1 }),
                      }))
                    }
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 폐기 일자 */}
            <div className='space-y-2'>
              <Label>
                폐기 일자 <span className='font-bold text-red-500'>*</span>
              </Label>
              <input type='hidden' name='processedAt' value={formData.processedAt.toISOString()} />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    name='processedAt'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.processedAt ? (
                      format(formData.processedAt, 'yyyy년 MM월 dd일', { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.processedAt}
                    onSelect={(date) =>
                      date && setFormData((prev) => ({ ...prev, processedAt: date }))
                    }
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 제보자 */}
            <div className='space-y-2'>
              <Label>
                제보자 <span className='font-bold text-red-500'>*</span>
              </Label>
              {fetcher.data?.errors?.reporter && (
                <div className='text-[13px] text-red-500'>{fetcher.data.errors.reporter}</div>
              )}
              <Input
                name='reporter'
                value={formData.reporter}
                onChange={(e) => setFormData((prev) => ({ ...prev, reporter: e.target.value }))}
                placeholder='1101 홍길동'
              />
            </div>

            {/* 인수자 */}
            <div className='space-y-2'>
              <Label>인수자</Label>
              {fetcher.data?.errors?.receiver && (
                <div className='text-[13px] text-red-500'>{fetcher.data.errors.receiver}</div>
              )}
              <Input
                name='receiver'
                value={formData.receiver ?? ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, receiver: e.target.value }))}
                placeholder='1101 홍길동'
              />
            </div>

            {/* 상태 */}
            <div className='space-y-2'>
              <Label>
                상태 <span className='font-bold text-red-500'>*</span>
              </Label>
              <input type='hidden' name='status' value={formData.status} />
              <Select
                value={formData.status}
                onValueChange={(value: 'PENDING' | 'RETURNED' | 'DISCARDED' | 'DELETED') =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id='status'>
                  <SelectValue placeholder='상태 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='PENDING'>보관중</SelectItem>
                  <SelectItem value='RETURNED'>반환됨</SelectItem>
                  <SelectItem value='DISCARDED'>폐기됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className='flex flex-row items-center justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/LNFMS')}
              className='cursor-pointer select-none'
            >
              취소
            </Button>
            <div className='flex items-center justify-center gap-2'>
              <Button
                type='button'
                variant='destructive'
                onClick={() => setDeleteDialogOpen(true)}
                className={`cursor-pointer select-none ${isNewItem ? 'invisible' : ''}`}
              >
                <Trash2 className={`mr-2 h-4 w-4`} />
                삭제
              </Button>
              {isNewItem ? (
                <Button
                  type='submit'
                  className={`cursor-pointer bg-green-500 text-white select-none hover:bg-green-600`}
                >
                  <PackagePlus
                    className={`mr-2 h-4 w-4 ${fetcher.state !== 'idle' ? 'hidden' : ''}`}
                  />
                  <LoaderCircle className={fetcher.state !== 'idle' ? 'animate-spin' : 'hidden'} />
                  등록
                </Button>
              ) : (
                <Button type='submit' className='cursor-pointer select-none'>
                  <Save className={`mr-2 h-4 w-4 ${fetcher.state !== 'idle' ? 'hidden' : ''}`} />
                  <LoaderCircle className={fetcher.state !== 'idle' ? 'animate-spin' : 'hidden'} />
                  저장
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </fetcher.Form>

      {/* 아이템 삭제 모달 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>분실물 삭제</DialogTitle>
            <DialogDescription>
              {item ? (
                <>
                  "{item.name}" 항목을 삭제하시겠습니까?
                  <br />
                  삭제한 항목은 다시 되돌릴 수 없습니다.
                </>
              ) : (
                <>
                  이 항목을 삭제하시겠습니까?
                  <br />
                  삭제한 항목은 다시 되돌릴 수 없습니다.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <fetcher.Form method='post'>
            <DialogFooter>
              <input type='hidden' name='uuid' value={item?.uuid} />
              <input type='hidden' name='type' value='deleteItem' />
              <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                취소
              </Button>
              <Button type='submit' variant='destructive'>
                삭제
              </Button>
            </DialogFooter>
          </fetcher.Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
