'use client';

import { useRouter } from 'next/navigation';
import { CreditCard, Grid3X3, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { t } from '@/lib/i18n';

interface DrawerNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DrawerNav = ({ open, onOpenChange }: DrawerNavProps) => {
  const router = useRouter();

  const menuItems = [
    {
      icon: CreditCard,
      label: t('navigation.buyCoin'),
      href: '/buy',
    },
    {
      icon: Grid3X3,
      label: t('navigation.listApps'),
      href: '/apps',
    },
    {
      icon: User,
      label: t('navigation.account'),
      href: '/account',
    },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='left' className='w-80'>
        <SheetHeader>
          <SheetTitle className='text-left'>{t('app.title')}</SheetTitle>
        </SheetHeader>

        <nav className='mt-8 space-y-2'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.href}
                variant='ghost'
                className='w-full justify-start h-12 px-4'
                onClick={() => handleNavigation(item.href)}
              >
                <Icon className='mr-3 h-5 w-5' />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className='absolute bottom-4 left-4 right-4'>
          <p className='text-xs text-muted-foreground text-center'>
            {t('app.prototype')}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
