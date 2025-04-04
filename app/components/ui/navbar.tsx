import * as React from 'react';
import { Link } from 'react-router';
import { Menu, House } from 'lucide-react';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';

interface navLinksType {
  href: string;
  label: string;
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [navLinks, setNavLinks] = React.useState<navLinksType[]>([]);

  React.useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };
    checkIsMobile();
    const handleResize = () => checkIsMobile();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (isMobile) {
      setNavLinks([{ href: '/LNFMS', label: 'LNFMS' }]);
    } else {
      setNavLinks([
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/LNFMS', label: 'LNFMS' },
      ]);
    }
  }, [isMobile]);

  return (
    <div className='flex h-16 w-full items-center justify-between px-2'>
      <div className='flex items-center justify-center gap-2 text-xl font-bold'>
        <Link to={'/'} className='flex gap-2'>
          <House />
          <span className='select-none'>능주고 분실물 안내 시스템</span>
        </Link>
      </div>
      {/* 데스크톱 네비게이션 */}
      <nav className='hidden items-center gap-6 md:flex'>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className='hover:text-primary rounded-lg p-2 text-sm font-medium transition-colors hover:bg-gray-100'
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {/* 모바일 네비게이션 */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className='md:hidden'>
          <Button variant='ghost' size='icon'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>메뉴 열기</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px]'>
          <div className='mt-8 flex flex-col gap-6 pl-6'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className='hover:text-primary text-lg font-medium transition-colors'
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
