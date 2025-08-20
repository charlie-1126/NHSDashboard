import * as React from 'react';
import { Link, useLocation } from 'react-router';
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

  const location = useLocation();
  function isActive(href: string) {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  }
  return (
    <div className='flex h-16 w-full items-center justify-between px-2'>
      <div className='flex items-center justify-center gap-2 text-xl font-bold'>
        <Link to={'/'} className='flex gap-2'>
          <House />
          <span className='select-none'>능주고 분실물 안내 시스템</span>
        </Link>
      </div>
      <nav className='hidden items-center gap-4 md:flex'>
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              to={link.href}
              className={`focus-visible:ring-ring relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              {link.label}
              {active && (
                <span className='bg-primary-foreground/70 absolute inset-x-2 -bottom-1 h-0.5 rounded-full md:inset-x-3' />
              )}
            </Link>
          );
        })}
      </nav>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className='md:hidden'>
          <Button variant='ghost' size='icon'>
            <Menu className='h-5 w-5' />
            <span className='sr-only'>메뉴 열기</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className='w-[300px]'>
          <div className='mt-8 flex flex-col gap-3 pl-2'>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2 text-base font-medium transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
