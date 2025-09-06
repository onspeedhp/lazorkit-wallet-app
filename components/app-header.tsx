'use client';

import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import { t } from '@/lib/i18n';
import { useWalletStore } from '@/lib/store/wallet';

interface AppHeaderProps {
  onMenuClick?: () => void;
  showMenu?: boolean;
  title?: string;
}

export const AppHeader = ({
  onMenuClick,
  showMenu = false,
  title,
}: AppHeaderProps) => {
  const { hasWallet } = useWalletStore();
  const shouldShowMenu = showMenu && hasWallet;

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 max-w-screen-2xl items-center px-4'>
        <div className='flex items-center space-x-3'>
          <div className='relative'>
            <div className='w-8 h-8 rounded-lg gradient-primary flex items-center justify-center animate-pulse-glow'>
              <span className='text-white font-bold text-sm'>L</span>
            </div>
            <div className='absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-bounce-gentle'></div>
          </div>
          <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
            {title || t('app.title')}
          </h1>
        </div>

        <div className='flex flex-1 items-center justify-end space-x-2'>
          {shouldShowMenu && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onMenuClick}
              className='h-10 w-10 p-0 hover:bg-primary/10 transition-all duration-200'
            >
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Open menu</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
