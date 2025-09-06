'use client';

import { Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CopyButton } from './ui/copy-button';
import { Blockie } from './ui/blockie';
import { useWalletStore } from '@/lib/store/wallet';
import { formatAddress, formatCurrency } from '@/lib/utils/format';
import { t } from '@/lib/i18n';

interface WalletBannerProps {
  onDepositClick?: () => void;
}

export const WalletBanner = ({ onDepositClick }: WalletBannerProps) => {
  const { pubkey, tokens, fiat, rateUsdToVnd } = useWalletStore();
  const [showBalance, setShowBalance] = useState(true);

  const totalBalance = tokens.reduce((sum, token) => {
    const value = token.amount * token.priceUsd;
    return sum + value;
  }, 0);

  const displayBalance =
    fiat === 'VND' ? totalBalance * rateUsdToVnd : totalBalance;

  return (
    <Card className='glass-card border-primary/20 hover:border-primary/40 transition-all duration-300'>
      <CardContent className='p-6'>
        <div className='space-y-6'>
          {/* Public Key */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 rounded overflow-hidden border border-primary/30 shadow-ambient'>
                <Blockie seed={pubkey || 'demo'} size={8} scale={5} />
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>
                  {t('wallet.publicKey')}
                </p>
                <p className='font-mono text-sm font-medium'>
                  {pubkey ? formatAddress(pubkey) : 'Not available'}
                </p>
              </div>
            </div>
            {pubkey && <CopyButton text={pubkey} />}
          </div>

          {/* Total Balance */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-sm'></div>
            <div className='relative bg-card/50 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-muted-foreground mb-1'>
                    {t('wallet.totalBalance')}
                  </p>
                  <div className='flex items-center space-x-2'>
                    <p className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                      {showBalance
                        ? formatCurrency(displayBalance, fiat)
                        : '••••••'}
                    </p>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setShowBalance(!showBalance)}
                      className='h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-200'
                    >
                      {showBalance ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='w-12 h-12 rounded-full gradient-accent flex items-center justify-center animate-pulse-glow'>
                    <span className='text-white text-lg'>💰</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className='flex space-x-3'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200'
              onClick={onDepositClick}
            >
              <Plus className='mr-2 h-4 w-4' />
              {t('wallet.deposit')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
