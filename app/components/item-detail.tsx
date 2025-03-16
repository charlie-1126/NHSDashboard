import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarIcon, ArrowLeft, Save, X } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import * as React from 'react';
import { useNavigate } from 'react-router';
import type { itemTable } from '~/db';

type ItemDetailProps = {
  item?: typeof itemTable.$inferSelect | null;
  id: string;
};

export function ItemDetail({ item, id }: ItemDetailProps) {
  const navigate = useNavigate();
  const isNewItem = !id || id === 'new';

  // 현재 날짜를 기본값으로 설정
  const today = new Date();

  // 폼 상태 관리
  const [formData, setFormData] = React.useState({
    name: item?.name || '',
    location: item?.location || '',
    createAt: item?.createdAt ? new Date(item.createdAt) : today,
    processedAt: item?.processedAt ? new Date(item.processedAt) : addDays(today, 14),
    reporter: item?.reporter || '',
    receiver: item?.receiver || '',
    status: item?.status || 'PENDING',
    imageUrl: item?.image || '',
  });

  // 이미지 미리보기 상태
  const [imagePreview, setImagePreview] = React.useState<string | null>(formData.imageUrl || null);

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

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    //저장 로직 구현(데이터 formData에 있음)
    navigate('/LNFMS');
  };

  // 취소 처리
  const handleCancel = () => {
    navigate('/LNFMS');
  };

  return (
    <div className='container mx-auto max-w-3xl p-4'>
      <div className='mb-4 flex items-center'>
        <button
          onClick={handleCancel}
          className='hover:bg-muted mr-2 cursor-pointer rounded-full p-2 transition-colors'
          aria-label='뒤로 가기'
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className='text-2xl font-bold'>{isNewItem ? '새 분실물 등록' : '분실물 상세 정보'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* 이미지 업로드 */}
            <div className='space-y-2'>
              <Label htmlFor='image'>사진</Label>
              <div className='flex flex-col items-center space-y-2'>
                {imagePreview ? (
                  <div className='relative'>
                    <img
                      src={imagePreview || '/image/noImg.gif'}
                      alt='미리보기'
                      className='h-48 w-48 cursor-pointer rounded-md border-2 border-gray-300 object-cover'
                      onClick={handleImageClick}
                    />
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      className='absolute top-0 right-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full'
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
                      className='h-48 w-48 cursor-pointer rounded-md border-2 border-gray-300 object-cover'
                      onClick={handleImageClick}
                    />
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id='image-upload'
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            {/* 이름 */}
            <div className='space-y-2'>
              <Label htmlFor='name'>이름 *</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder='분실물 이름'
                required
              />
            </div>

            {/* 취득일자 */}
            <div className='space-y-2'>
              <Label htmlFor='createAt'>취득일자 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='createAt'
                    variant='outline'
                    className='w-full justify-start text-left font-normal'
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {formData.createAt ? (
                      format(formData.createAt, 'yyyy년 MM월 dd일', { locale: ko })
                    ) : (
                      <span>날짜 선택</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={formData.createAt}
                    onSelect={(date) =>
                      date &&
                      setFormData((prev) => ({
                        ...prev,
                        createAt: date,
                        processedAt: addDays(date, 14),
                      }))
                    }
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* 취득장소 */}
            <div className='space-y-2'>
              <Label htmlFor='location'>취득장소 *</Label>
              <Input
                id='location'
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder='취득 장소'
                required
              />
            </div>

            {/* 폐기일자 */}
            <div className='space-y-2'>
              <Label htmlFor='processedAt'>폐기일자 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id='processedAt'
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
              <Label htmlFor='reporter'>제보자</Label>
              <Input
                id='reporter'
                value={formData.reporter}
                onChange={(e) => setFormData((prev) => ({ ...prev, reporter: e.target.value }))}
                placeholder='제보자 이름'
              />
            </div>

            {/* 인수자 */}
            <div className='space-y-2'>
              <Label htmlFor='receiver'>인수자</Label>
              <Input
                id='receiver'
                value={formData.receiver}
                onChange={(e) => setFormData((prev) => ({ ...prev, receiver: e.target.value }))}
                placeholder='인수자 이름'
              />
            </div>

            {/* 상태 */}
            <div className='space-y-2'>
              <Label htmlFor='status'>상태 *</Label>
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
                  <SelectItem value='PENDING'>대기중</SelectItem>
                  <SelectItem value='RETURNED'>반환됨</SelectItem>
                  <SelectItem value='DISCARDED'>폐기됨</SelectItem>
                  <SelectItem value='DELETED'>삭제됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              취소
            </Button>
            <Button type='submit'>
              <Save className='mr-2 h-4 w-4' />
              저장
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
